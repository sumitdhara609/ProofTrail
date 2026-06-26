"use client";

import { useActionState } from "react";
import { addEvidence } from "@/app/vault/[achievementId]/actions";

type AddEvidenceFormProps = {
  achievementId: string;
};

export function AddEvidenceForm({ achievementId }: AddEvidenceFormProps) {
  const boundAction = addEvidence.bind(null, achievementId);
  const [state, formAction, isPending] = useActionState(boundAction, {});

  return (
    <form action={formAction} className="mt-6 space-y-5">
      {state.error ? (
        <div className="rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]">
          {state.error}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="evidenceType"
          className="text-sm font-semibold text-[var(--text-secondary)]"
        >
          Evidence type
        </label>
        <select
          id="evidenceType"
          name="evidenceType"
          defaultValue="project_link"
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
      </div>

      <div>
        <label
          htmlFor="title"
          className="text-sm font-semibold text-[var(--text-secondary)]"
        >
          Evidence title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="GitHub repository / Certificate page / Published article"
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
        />
      </div>

      <div>
        <label
          htmlFor="sourceUrl"
          className="text-sm font-semibold text-[var(--text-secondary)]"
        >
          Source URL
        </label>
        <input
          id="sourceUrl"
          name="sourceUrl"
          type="url"
          inputMode="url"
          placeholder="https://..."
          title="Enter a valid URL beginning with http:// or https://"
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] invalid:border-[var(--danger-border)] focus:border-[var(--accent)]"
        />
        <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
          Add a source link when the evidence exists publicly or online.
        </p>
      </div>

      <div>
        <label
          htmlFor="mediaFile"
          className="text-sm font-semibold text-[var(--text-secondary)]"
        >
          Media evidence
        </label>
        <input
          id="mediaFile"
          name="mediaFile"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          className="mt-2 w-full rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-secondary)] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[var(--text-primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--background)] hover:border-[var(--accent)] focus:border-[var(--accent)]"
        />
        <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
          Optional. Upload a certificate, screenshot, proof image, moment photo,
          or PDF. Maximum size: 5 MB.
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-sm font-semibold text-[var(--text-secondary)]"
        >
          Evidence note
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Briefly explain what this evidence proves."
          className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
        />
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-secondary)]">
        <input
          name="isPublic"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-[var(--border)] bg-[var(--surface)] accent-[var(--accent)]"
        />
        <span>
          Allow this evidence to appear on public proof cards when the record is
          shared.
        </span>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] shadow-[var(--shadow-soft)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Adding evidence..." : "Add evidence"}
      </button>
    </form>
  );
}