import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DNS,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: process.env.SENTRY_TRACE_SAMPLE_RATE ? +process.env.SENTRY_TRACE_SAMPLE_RATE : undefined,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
  ],
});
