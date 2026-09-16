const CAMPAIGN = {
  utm_source: 'mxesa.in',
  utm_medium: 'website',
  utm_campaign: 'mxesa-2026',
};

export const campaignFor = (content) => ({
  ...CAMPAIGN,
  utm_content: content,
});
