"use client";

import { ChevronDown, Download, RotateCcw, WandSparkles } from "lucide-react";
import { memo, type ReactNode, useId, useState } from "react";

import {
  buildResultFocusHeading,
  getResultFocusNote,
  getResultProcessSummary,
  type ResultMediaKind
} from "./studio-result-focus.helpers";

type StudioResultFocusMetaItem = Readonly<{
  label: string;
  value: string;
}>;

type StudioResultFocusProcessEvent = Readonly<{
  id: string;
  label: string;
  meta: string;
  time: string;
}>;

type StudioResultFocusProps = Readonly<{
  mediaKind: ResultMediaKind;
  mediaSrc: string;
  metaItems: readonly StudioResultFocusMetaItem[];
  onDownload: () => void;
  onNewVariation: () => void;
  onRetry: () => void;
  processEvents: readonly StudioResultFocusProcessEvent[];
  prompt: string;
  referencePreviewUrl?: string;
  statusLabel: string;
  title: string;
}>;

type ResultMediaFrameProps = Readonly<{
  displayTitle: string;
  mediaKind: ResultMediaKind;
  mediaSrc: string;
}>;

type ResultMetaGridProps = Readonly<{
  metaItems: readonly StudioResultFocusMetaItem[];
}>;

type ResultDetailsBodyProps = Readonly<{
  prompt: string;
  referencePreviewUrl?: string;
}>;

type ResultProcessTimelineProps = Readonly<{
  events: readonly StudioResultFocusProcessEvent[];
}>;

type ResultDisclosurePanelProps = Readonly<{
  bodyClassName?: string;
  children: ReactNode;
  summary: string;
  title: string;
}>;

const ResultMediaFrame = memo(function ResultMediaFrame({
  displayTitle,
  mediaKind,
  mediaSrc
}: ResultMediaFrameProps) {
  return (
    <div className="studio-result-focus-media-shell">
      <div className="studio-result-focus-media">
        {mediaKind === "image" ? <img alt={displayTitle} decoding="async" src={mediaSrc} /> : null}
        {mediaKind === "video" ? <video controls playsInline preload="metadata" src={mediaSrc} /> : null}
      </div>
    </div>
  );
});

const ResultMetaGrid = memo(function ResultMetaGrid({ metaItems }: ResultMetaGridProps) {
  return (
    <dl className="studio-result-focus-meta">
      {metaItems.map((item) => (
        <div className="studio-result-focus-meta-card" key={`${item.label}-${item.value}`}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
});

const ResultDetailsBody = memo(function ResultDetailsBody({
  prompt,
  referencePreviewUrl
}: ResultDetailsBodyProps) {
  return (
    <div className="studio-result-focus-details-grid">
      <section className="studio-result-focus-detail-card">
        <div className="studio-result-focus-detail-label">Prompt</div>
        <div className="studio-result-focus-detail-copy">{prompt}</div>
      </section>

      {referencePreviewUrl ? (
        <section className="studio-result-focus-detail-card studio-result-focus-reference-card">
          <div className="studio-result-focus-detail-label">Reference</div>
          <img alt="Reference used for this render" decoding="async" src={referencePreviewUrl} />
          <div className="studio-result-focus-reference-note">This render used a saved reference image.</div>
        </section>
      ) : null}
    </div>
  );
});

const ResultProcessTimeline = memo(function ResultProcessTimeline({
  events
}: ResultProcessTimelineProps) {
  return (
    <div aria-label="Render lifecycle" className="studio-result-focus-process-timeline" role="list">
      {events.map((event) => (
        <article className="studio-result-focus-process-event" key={event.id} role="listitem">
          <div aria-hidden="true" className="studio-result-focus-process-marker">
            <div className="studio-result-focus-process-dot" />
          </div>
          <div className="studio-result-focus-process-content">
            <div className="studio-result-focus-process-head">
              <div className="studio-result-focus-process-label">{event.label}</div>
              <time className="studio-result-focus-process-time">{event.time}</time>
            </div>
            <div className="studio-result-focus-process-meta">{event.meta}</div>
          </div>
        </article>
      ))}
    </div>
  );
});

function ResultDisclosurePanel({
  bodyClassName,
  children,
  summary,
  title
}: ResultDisclosurePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <section className={`studio-result-focus-panel${isOpen ? " open" : ""}`}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className={`studio-result-focus-toggle${isOpen ? " open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="studio-result-focus-toggle-copy">
          <span className="studio-result-focus-toggle-title">{title}</span>
          <span className="studio-result-focus-toggle-summary">{summary}</span>
        </span>
        <span className="studio-result-focus-toggle-trailing">
          <span className="studio-result-focus-toggle-state">{isOpen ? "Hide" : "Show"}</span>
          <ChevronDown
            aria-hidden="true"
            className="studio-result-focus-toggle-chevron"
            size={16}
            strokeWidth={1.9}
          />
        </span>
      </button>

      {isOpen ? (
        <div className={`studio-result-focus-panel-body${bodyClassName ? ` ${bodyClassName}` : ""}`} id={panelId}>
          {children}
        </div>
      ) : null}
    </section>
  );
}

export function StudioResultFocus({
  mediaKind,
  mediaSrc,
  metaItems,
  onDownload,
  onNewVariation,
  onRetry,
  processEvents,
  prompt,
  referencePreviewUrl,
  statusLabel,
  title
}: StudioResultFocusProps) {
  const titleId = useId();
  const displayTitle = buildResultFocusHeading(mediaKind, title, prompt);
  const detailsSummary = referencePreviewUrl ? "Prompt and reference" : "Prompt snapshot";
  const processSummary = getResultProcessSummary(processEvents.length);
  const supportingNote = getResultFocusNote(mediaKind);

  return (
    <section
      aria-labelledby={titleId}
      className="studio-result-focus"
      data-has-reference={referencePreviewUrl ? "true" : "false"}
      data-kind={mediaKind}
    >
      <div className="studio-result-focus-stage">
        <ResultMediaFrame displayTitle={displayTitle} mediaKind={mediaKind} mediaSrc={mediaSrc} />

        <aside className="studio-result-focus-rail">
          <header className="studio-result-focus-head">
            <div className="studio-result-focus-copy">
              <div className="studio-result-focus-topline">
                <span>{mediaKind} result</span>
                <span className="studio-result-focus-status">{statusLabel}</span>
              </div>
              <h2 id={titleId}>{displayTitle}</h2>
              <p className="studio-result-focus-note">{supportingNote}</p>
            </div>

            <div className="studio-result-focus-actions">
              <button
                aria-label={`Create a new variation from this ${mediaKind}`}
                className="button studio-result-focus-action-primary"
                onClick={onNewVariation}
                type="button"
              >
                <WandSparkles aria-hidden="true" size={15} strokeWidth={1.9} />
                <span>New variation</span>
              </button>
              <button
                aria-label={`Download this ${mediaKind}`}
                className="button-secondary studio-result-focus-action"
                onClick={onDownload}
                type="button"
              >
                <Download aria-hidden="true" size={15} strokeWidth={1.9} />
                <span>Download</span>
              </button>
              <button
                aria-label={`Retry this ${mediaKind} render`}
                className="button-secondary studio-result-focus-action"
                onClick={onRetry}
                type="button"
              >
                <RotateCcw aria-hidden="true" size={15} strokeWidth={1.9} />
                <span>Retry</span>
              </button>
            </div>
          </header>

          <ResultMetaGrid metaItems={metaItems} />

          <div className="studio-result-focus-panels">
            <ResultDisclosurePanel summary={detailsSummary} title="Details">
              <ResultDetailsBody prompt={prompt} referencePreviewUrl={referencePreviewUrl} />
            </ResultDisclosurePanel>

            {processEvents.length > 0 ? (
              <ResultDisclosurePanel
                bodyClassName="studio-result-focus-process"
                summary={processSummary}
                title="Process"
              >
                <ResultProcessTimeline events={processEvents} />
              </ResultDisclosurePanel>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
