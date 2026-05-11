import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiHome, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

// ── Validation rules ───────────────────────────────────────────────────────
const validate = (field, value) => {
  switch (field) {
    case 'name':
      if (!value.trim())       return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return '';

    case 'email':
      if (!value.trim())       return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address (e.g. name@example.com)';
      return '';

    case 'phone':
      if (!value.trim())       return 'Phone number is required';
      if (/[^0-9]/.test(value)) return 'Phone number must contain numbers only — no spaces or symbols';
      if (value.length < 11)   return `Phone number must be 11 digits (${value.length}/11 entered)`;
      if (value.length > 11)   return 'Phone number cannot be more than 11 digits';
      return '';

    case 'password':
      if (!value)              return 'Password is required';
      if (value.length < 6)   return 'Password must be at least 6 characters';
      return '';

    case 'confirm':
      return ''; // checked separately with password value

    default:
      return '';
  }
};

// ── Input field component ──────────────────────────────────────────────────
function Field({ icon, type, name, placeholder, value, onChange, onBlur, error, touched, success }) {
  const [showPw, setShowPw] = useState(false);
  const inputType = type === 'password' ? (showPw ? 'text' : 'password') : type;
  const borderColor = touched
    ? error ? '#dc2626' : success ? '#059669' : '#e5e7eb'
    : '#e5e7eb';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <div style={{ position: 'relative' }}>
        {/* Left icon */}
        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: touched && error ? '#dc2626' : '#9ca3af', pointerEvents: 'none', fontSize: '1rem' }}>
          {icon}
        </span>

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={name === 'phone' ? 11 : undefined}
          style={{ width: '100%', border: `1.5px solid ${borderColor}`, borderRadius: '0.75rem', padding: '0.75rem 2.8rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box', background: '#fff', color: '#1f2937' }}
          onFocus={(e) => (e.target.style.borderColor = '#059669')}
        />

        {/* Right: password toggle OR status icon */}
        {type === 'password' ? (
          <button type="button" onClick={() => setShowPw((p) => !p)}
            style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            {showPw ? <FiEyeOff /> : <FiEye />}
          </button>
        ) : touched ? (
          <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            {error
              ? <FiAlertCircle style={{ color: '#dc2626' }} />
              : <FiCheckCircle style={{ color: '#059669' }} />}
          </span>
        ) : null}
      </div>

      {/* Inline error message */}
      {touched && error && (
        <p style={{ fontSize: '0.78rem', color: '#dc2626', display: 'flex', alignItems: 'flex-start', gap: '0.3rem', lineHeight: '1.4' }}>
          <FiAlertCircle style={{ marginTop: '0.1rem', flexShrink: 0 }} /> {error}
        </p>
      )}

      {/* Phone digit counter */}
      {name === 'phone' && value.length > 0 && (
        <p style={{ fontSize: '0.75rem', color: value.length === 11 ? '#059669' : '#9ca3af', textAlign: 'right' }}>
          {value.length} / 11 digits
        </p>
      )}
    </div>
  );
}

// ── Register Page ──────────────────────────────────────────────────────────
export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '',
  });

  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  // Real-time validation on change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: only allow digit input
    if (name === 'phone' && /[^0-9]/.test(value)) {
      setErrors((prev) => ({ ...prev, phone: 'Phone number must contain numbers only — no spaces or symbols' }));
      setTouched((prev) => ({ ...prev, phone: true }));
      // Still update form but strip non-digits
      setForm((prev) => ({ ...prev, phone: value.replace(/[^0-9]/g, '') }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field already touched
    if (touched[name]) {
      const err = name === 'confirm'
        ? (value !== form.password ? 'Passwords do not match' : '')
        : validate(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }

    // Re-validate confirm when password changes
    if (name === 'password' && touched.confirm) {
      setErrors((prev) => ({ ...prev, confirm: form.confirm !== value ? 'Passwords do not match' : '' }));
    }
  };

  // Validate on blur (first time user leaves a field)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = name === 'confirm'
      ? (value !== form.password ? 'Passwords do not match' : '')
      : validate(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const hasErrors = () => {
    const fields = ['name', 'email', 'phone', 'password', 'confirm'];
    return fields.some((f) => {
      if (f === 'confirm') return form.confirm !== form.password || !form.confirm;
      return validate(f, form[f]) !== '';
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Touch and validate all fields
    const allTouched = { name: true, email: true, phone: true, password: true, confirm: true };
    setTouched(allTouched);

    const allErrors = {
      name:     validate('name',     form.name),
      email:    validate('email',    form.email),
      phone:    validate('phone',    form.phone),
      password: validate('password', form.password),
      confirm:  form.confirm !== form.password ? 'Passwords do not match' : '',
    };
    setErrors(allErrors);

    if (Object.values(allErrors).some((e) => e !== '')) return;

    setLoading(true);
    try {
      const user = await register({
        name:     form.name.trim(),
        email:    form.email.trim(),
        phone:    form.phone,
        password: form.password,
      });
      toast.success(`Welcome to Bhara, ${user.name}! 🎉`);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);

      // Highlight the relevant field if server returns a specific error
      if (msg.toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, email: msg }));
        setTouched((prev) => ({ ...prev, email: true }));
      } else if (msg.toLowerCase().includes('phone')) {
        setErrors((prev) => ({ ...prev, phone: msg }));
        setTouched((prev) => ({ ...prev, phone: true }));
      }
    }
    setLoading(false);
  };

  const fields = [
    { icon: <FiUser />,  type: 'text',     name: 'name',     placeholder: 'Full Name'                     },
    { icon: <FiMail />,  type: 'email',    name: 'email',    placeholder: 'Email Address (e.g. you@mail.com)' },
    { icon: <FiPhone />, type: 'tel',      name: 'phone',    placeholder: '11-digit Phone Number (e.g. 01XXXXXXXXX)' },
    { icon: <FiLock />,  type: 'password', name: 'password', placeholder: 'Password (min 6 characters)'   },
    { icon: <FiLock />,  type: 'password', name: 'confirm',  placeholder: 'Confirm Password'               },
  ];

  const allValid = !hasErrors() && Object.values(form).every((v) => v.trim() !== '');

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ maxWidth: '28rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.875rem', fontWeight: '900', color: '#059669', marginBottom: '0.4rem' }}>
            <FiHome /> Bhara
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.2rem' }}>Create an account</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Join thousands finding homes on Bhara</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }} noValidate>
          {fields.map((f) => (
            <Field
              key={f.name}
              icon={f.icon}
              type={f.type}
              name={f.name}
              placeholder={f.placeholder}
              value={form[f.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors[f.name]}
              touched={!!touched[f.name]}
              success={touched[f.name] && !errors[f.name] && form[f.name]}
            />
          ))}

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#9ca3af' : '#059669', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.85rem', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', marginTop: '0.25rem', transition: 'background 0.2s' }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#047857'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#059669'; }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.25rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#059669', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}