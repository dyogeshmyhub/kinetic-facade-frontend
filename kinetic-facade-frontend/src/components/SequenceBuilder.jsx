import { steps } from '../data/dashboardData'
import { Check, Circle, Play } from 'lucide-react'

function SequenceBuilder({ activeStep, isRunning, onRun }) {
  return (
    <section className="panel sequence-panel">
      <div className="panel__header">
        <div><div className="panel__eyebrow">Sequence A-01 · Facade opening cycle</div><h2>Sequence builder</h2></div>
        <button className="btn btn--primary" type="button" onClick={onRun} disabled={isRunning}><Play size={14} />
          {isRunning ? 'Sequence running' : 'Run sequence'}
        </button>
      </div>

      <div className="sequence-list">
        {steps.map((step, index) => (
          <div key={step} className={`sequence-item ${index === activeStep ? 'sequence-item--active' : ''} ${index < activeStep ? 'sequence-item--complete' : ''}`}>
            <span className="sequence-number">{index < activeStep ? <Check size={14} /> : index === activeStep ? <Play size={12} /> : <Circle size={11} />}</span>
            <span className="sequence-item__content"><strong>{step}</strong><small>{index < activeStep ? 'Completed' : index === activeStep ? 'Active checkpoint' : 'Waiting'}</small></span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SequenceBuilder
