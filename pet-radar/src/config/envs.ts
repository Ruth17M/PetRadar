export const envs = {
  MAILER_SERVICE: process.env.MAILER_SERVICE || 'gmail',
  MAILER_EMAIL: process.env.MAILER_EMAIL ?? '',
  MAILER_PASSWORD: process.env.MAILER_PASSWORD ?? '',
  MAIL_TO: process.env.MAIL_TO ?? process.env.MAILER_EMAIL ?? '',
};
