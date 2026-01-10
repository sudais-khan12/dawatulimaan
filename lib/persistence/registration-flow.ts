import { getEventBySlug } from "@/lib/persistence/events";
import {
  createRegistration,
  type RegistrationInsert,
} from "@/lib/persistence/registrations";
import { getSupabaseClient } from "@/lib/supabase/client";
import { sendMail } from "@/lib/email/mailer";

export type RegistrationRequest = RegistrationInsert & { eventSlug?: string };

export const registerForEvent = async (payload: RegistrationRequest) => {
  const { eventSlug, eventId, ...rest } = payload;
  const client = getSupabaseClient();

  let resolvedEventId = eventId;
  let resolvedEventTitle: string | null = null;

  if (eventSlug) {
    const { data, error } = await getEventBySlug(eventSlug, client);
    if (error) {
      return { data: null, error };
    }
    if (!data) {
      return { data: null, error: new Error("Event not found.") };
    }
    resolvedEventId = data.id;
    resolvedEventTitle = data.title ?? data.slug;
  }

  if (!resolvedEventId) {
    return { data: null, error: new Error("Missing event identifier.") };
  }

  const registrationResult = await createRegistration(
    {
      eventId: resolvedEventId,
      person: rest.person,
      attendance: rest.attendance,
      volunteer: rest.volunteer,
    },
    client,
  );

  if (registrationResult.error || !registrationResult.data) {
    return registrationResult;
  }

  // Fire-and-forget confirmation email, but ensure only once per event/person.
  const registration = registrationResult.data;
  const fullName = `${rest.person.firstName} ${rest.person.lastName}`.trim();
  const eventName = resolvedEventTitle ?? "your event";

  const recordConfirmation = async () => {
    // Use event_email_sends as idempotency key on (event_id, person_id, email_type).
    const { error } = await client
      .from("event_email_sends")
      .upsert(
        {
          event_id: resolvedEventId,
          person_id: registration.person_id,
          email_type: "registration_confirmation",
        },
        { onConflict: "event_id,person_id,email_type" },
      );

    if (error) {
      // Ignore conflicts; treat as already sent.
      if (error.code === "23505" || error.code === "409") {
        return false;
      }
      // Log with context; do not block flow.
      console.error("Failed to record confirmation send", {
        event_id: resolvedEventId,
        person_id: registration.person_id,
        email_type: "registration_confirmation",
        error,
      });
      return false;
    }

    return true;
  };

  const shouldSend = await recordConfirmation();

  if (shouldSend) {
    try {
      await sendMail({
        to: rest.person.email,
        subject: `You're registered for ${eventName}`,
        html: `
          <p>Hi ${fullName || "there"},</p>
          <p>Thank you for registering for <strong>${eventName}</strong>.</p>
          <p>We look forward to seeing you there.</p>
        `,
      });
      console.log("Confirmation email sent", {
        event_id: resolvedEventId,
        person_id: registration.person_id,
        email_type: "registration_confirmation",
      });
    } catch (err) {
      console.error("Confirmation email failed", {
        event_id: resolvedEventId,
        person_id: registration.person_id,
        email_type: "registration_confirmation",
        error: err,
      });
    }
  }

  return registrationResult;
};
