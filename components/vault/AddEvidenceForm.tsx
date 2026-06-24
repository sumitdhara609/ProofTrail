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
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
          {state.error}
        </div>
      ) : null}

      <div>
        <label htmlFor="evidenceType" className="text-sm font-medium text-white/70">
          Evidence type
        </label>
        <select
          id="evidenceType"
          name="evidenceType"
          defaultValue="project_link"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
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
        <label htmlFor="title" className="text-sm font-medium text-white/70">
          Evidence title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="GitHub repository / Certificate page / Published article"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40"
        />
      </div>

      <div>
        <label htmlFor="sourceUrl" className="text-sm font-medium text-white/70">
          Source URL
        </label>
        <input
          id="sourceUrl"
          name="sourceUrl"
          type="url"
          placeholder="https://..."
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40"
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-white/70">
          Evidence note
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Briefly explain what this evidence proves."
          className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40"
        />
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
        <input
          name="isPublic"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-white/20 bg-black"
        />
        <span>
          Allow this evidence to appear on public proof cards when the record is shared.
        </span>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Adding evidence..." : "Add evidence"}
      </button>
    </form>
  );
}