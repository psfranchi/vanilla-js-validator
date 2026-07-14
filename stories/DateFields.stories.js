import { mountValidatedForm, field, actions } from './helpers.js';

export default {
  title: 'Fields/Dates & time',
};

export const DateTimeControls = {
  name: 'Date / time / datetime-local',
  render: () =>
    mountValidatedForm(`
      ${field('Start date', `<input name="start" type="date" required />`)}
      ${field('Alarm', `<input name="alarm" type="time" required />`)}
      ${field('Appointment', `<input name="when" type="datetime-local" required />`)}
      ${actions()}
    `),
};

export const MonthAndWeek = {
  name: 'Month / week',
  render: () =>
    mountValidatedForm(`
      ${field('Billing month', `<input name="month" type="month" required />`)}
      ${field('Sprint week', `<input name="week" type="week" required />`)}
      ${actions()}
    `),
};
