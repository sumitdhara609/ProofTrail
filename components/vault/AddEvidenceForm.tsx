"use client";

import { ReactNode, useActionState } from "react";
import { addEvidence } from "@/app/vault/[achievementId]/actions";

type AddEvidenceFormProps = {
  achievementId: string;
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-semibold text-[var(--text-primary)]"
    >
      {children}
    </label>
  );
}

function FieldHint({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
      {children}
    </p>
  );
}

function PrimarySubmitButton({
  children,
  isPending,
}: {
  children: ReactNode;
  isPending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#171512] bg-[#171512] px-6 py-3 text-sm font-semibold shadow-[var(--shadow-button)] transition hover:-translate-y-0.5 hover:bg-[#2a251f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#fffaf1] dark:bg-[#fffaf1] dark:hover:bg-[#eadfce]"
    >
      <span className="!text-[#fffaf1] dark:!text-[#171512]">
        {children}
      </span>
    </button>
  );
}

export function AddEvidenceForm({ achievementId }: AddEvidenceFormProps) {
  const boundAction = addEvidence.bind(null, achievementId);
  const [state, formAction, isPending] = useActionState(boundAction, {});

  return (
    <form action={formAction} className="mt-6 space-y-6">
      {state.error ? (
        <div className="rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]">
          <p className="font-semibold">Evidence could not be added.</p>
          <p className="mt-2 leading-6">{state.error}</p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Certificate-ready intake
        </p>

        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          Upload certificates privately first. Review the title, note, media
          frame, and public visibility before allowing anything to appear on a
          public proof card.
        </p>
      </div>

      <div>
        <FieldLabel htmlFor="evidenceType">Evidence type</FieldLabel>
        <select
          id="evidenceType"
          name="evidenceType"
          defaultValue="certificate"
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
        >
          <option value="certificate">Certificate</option>
          <option value="document">Document</option>
          <option value="image">Image</option>
          <option value="project_link">Project link</option>
          <option value="publication_link">Publication link</option>
          <option value="social_post">Social post</option>
          <option value="letter">Letter</option>
          <option value="other">Other</option>
        </select>
        <FieldHint>
          Choose Certificate for training certificates, course completions,
          participation records, grades, and formal recognition.
        </FieldHint>
      </div>

      <div>
        <FieldLabel htmlFor="title">Evidence title</FieldLabel>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Certificate of Publishing — Rethink What We Eat"
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
        />
        <FieldHint>
          Use a precise title so the evidence is easy to identify when your
          vault grows to dozens of certificates.
        </FieldHint>
      </div>

      <div>
        <FieldLabel htmlFor="sourceUrl">Source URL</FieldLabel>
        <input
          id="sourceUrl"
          name="sourceUrl"
          type="url"
          inputMode="url"
          placeholder="https://..."
          title="Enter a valid URL beginning with http:// or https://"
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] invalid:border-[var(--danger-border)] focus:border-[var(--accent)]"
        />
        <FieldHint>
          Optional. Add this only when the certificate has an official
          verification page, course page, event page, publication page, project
          reference, or public source.
        </FieldHint>
      </div>

      <div>
        <FieldLabel htmlFor="mediaFile">Certificate or media file</FieldLabel>
        <input
          id="mediaFile"
          name="mediaFile"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          className="mt-2 w-full rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-secondary)] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#171512] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#fffaf1] hover:border-[var(--accent)] focus:border-[var(--accent)] dark:file:bg-[#fffaf1] dark:file:text-[#171512]"
        />
        <FieldHint>
          Optional. Upload a certificate image, scanned PDF, proof screenshot,
          award photo, or supporting document. Maximum size: 5 MB.
        </FieldHint>
      </div>

      <div>
        <FieldLabel htmlFor="description">Evidence note</FieldLabel>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Briefly explain what this certificate proves, who issued it, and why it supports the achievement record."
          className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
        />
        <FieldHint>
          Mention the issuing body, course/program/event, grade/result if
          relevant, and what this evidence confirms.
        </FieldHint>
      </div>

      <div className="rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5">
        <p className="text-sm font-semibold text-[var(--danger)]">
          Public visibility safety
        </p>

        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
          Keep certificate evidence private during intake. Make it public only
          after checking that the certificate image/PDF, personal details, and
          proof-page presentation are ready to be seen by others.
        </p>

        <label className="mt-4 flex items-start gap-3 rounded-2xl border border-[var(--danger-border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
          <input
            name="isPublic"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-[var(--danger-border)] bg-[var(--surface)] accent-[var(--danger)]"
          />
          <span>
            Allow this evidence to appear on public proof cards when the record
            is shared. Leave unchecked while reviewing certificates privately.
          </span>
        </label>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Recommended certificate workflow
        </p>

        <div className="mt-4 space-y-3">
          {[
            "Add the certificate as private evidence.",
            "Review the title, issuer, date, and evidence note.",
            "Open the dossier and check how the record reads.",
            "Only then decide whether the evidence should become public.",
          ].map((step, index) => (
            <div key={step} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] font-mono text-xs font-semibold text-[var(--text-muted)]">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      <PrimarySubmitButton isPending={isPending}>
        {isPending ? "Adding evidence..." : "Add evidence privately"}
      </PrimarySubmitButton>
    </form>
  );
}