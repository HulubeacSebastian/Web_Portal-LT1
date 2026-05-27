const STEPS = [
  { id: 1, label: 'Parola' },
  { id: 2, label: 'Cod OTP' },
  { id: 3, label: 'Sesiune' }
];

function stepState(stepId, currentStep) {
  if (stepId < currentStep) {
    return 'is-complete';
  }
  if (stepId === currentStep) {
    return 'is-current';
  }
  return 'is-upcoming';
}

function AuthStepper({ currentStep = 1 }) {
  return (
    <nav className="auth-stepper" aria-label="Progres autentificare">
      <ol className="auth-stepper-list">
        {STEPS.map((step, index) => (
          <li
            key={step.id}
            className={`auth-stepper-item ${stepState(step.id, currentStep)}`}
          >
            <span className="auth-stepper-marker" aria-hidden="true">
              {step.id < currentStep ? '✓' : step.id}
            </span>
            <span className="auth-stepper-label">{step.label}</span>
            {index < STEPS.length - 1 ? (
              <span className="auth-stepper-line" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default AuthStepper;
