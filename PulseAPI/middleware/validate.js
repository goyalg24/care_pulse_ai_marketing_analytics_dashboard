function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function validateRegister(req, _res, next) {
  const { name, email, password, role } = req.body;
  const details = [];
  if (!name || name.trim().length < 2) details.push('Name must be at least 2 characters.');
  if (!email || !isEmail(email)) details.push('A valid email is required.');
  if (!password || password.length < 6) details.push('Password must be at least 6 characters.');
  if (role && !['admin', 'analyst'].includes(role)) details.push('Role must be admin or analyst.');
  if (details.length) {
    const error = new Error('Registration validation failed');
    error.status = 400;
    error.details = details;
    return next(error);
  }
  next();
}

export function validateLogin(req, _res, next) {
  const { email, password } = req.body;
  const details = [];
  if (!email || !isEmail(email)) details.push('A valid email is required.');
  if (!password) details.push('Password is required.');
  if (details.length) {
    const error = new Error('Login validation failed');
    error.status = 400;
    error.details = details;
    return next(error);
  }
  next();
}

export function validateCampaign(req, _res, next) {
  const { title, channel, start_date, end_date, owner_id } = req.body;
  const details = [];
  if (!title || title.trim().length < 3) details.push('Campaign title must be at least 3 characters.');
  if (!channel || channel.trim().length < 2) details.push('Channel is required.');
  if (!start_date || !isDate(start_date)) details.push('Valid start_date is required in YYYY-MM-DD format.');
  if (!end_date || !isDate(end_date)) details.push('Valid end_date is required in YYYY-MM-DD format.');
  if (start_date && end_date && start_date > end_date) details.push('start_date must be before or equal to end_date.');
  if (owner_id !== undefined && (!Number.isInteger(owner_id) || owner_id <= 0)) details.push('owner_id must be a positive integer.');
  if (details.length) {
    const error = new Error('Campaign validation failed');
    error.status = 400;
    error.details = details;
    return next(error);
  }
  next();
}

export function validateSegment(req, _res, next) {
  const { name, criteria, created_by } = req.body;
  const details = [];
  if (!name || name.trim().length < 3) details.push('Segment name must be at least 3 characters.');
  if (criteria === undefined || typeof criteria !== 'object' || Array.isArray(criteria)) {
    details.push('criteria must be a JSON object.');
  }
  if (created_by !== undefined && (!Number.isInteger(created_by) || created_by <= 0)) {
    details.push('created_by must be a positive integer.');
  }
  if (details.length) {
    const error = new Error('Segment validation failed');
    error.status = 400;
    error.details = details;
    return next(error);
  }
  next();
}

export function validateReport(req, _res, next) {
  const { campaign_id, segment_id, metrics_data } = req.body;
  const details = [];
  if (!Number.isInteger(campaign_id) || campaign_id <= 0) details.push('campaign_id must be a positive integer.');
  if (!Number.isInteger(segment_id) || segment_id <= 0) details.push('segment_id must be a positive integer.');
  if (!metrics_data || typeof metrics_data !== 'object' || Array.isArray(metrics_data)) {
    details.push('metrics_data must be a JSON object.');
  }
  if (details.length) {
    const error = new Error('Report validation failed');
    error.status = 400;
    error.details = details;
    return next(error);
  }
  next();
}

export function validateAiChat(req, _res, next) {
  const { prompt } = req.body;
  if (!prompt || prompt.trim().length < 5) {
    const error = new Error('Prompt must be at least 5 characters.');
    error.status = 400;
    return next(error);
  }
  next();
}
