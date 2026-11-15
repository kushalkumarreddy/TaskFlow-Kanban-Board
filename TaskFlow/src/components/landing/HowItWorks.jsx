import React from 'react';

function HowItWorks() {

  const steps = [
    {
      number: '01',
      icon: 'bi-person-plus',
      title: 'Create Your Account',
      description: 'Register and set up your personal productivity workspace.'
    },
    {
      number: '02',
      icon: 'bi-kanban',
      title: 'Create Your Boards',
      description: 'Create boards and add tasks with priorities and deadlines.'
    },
    {
      number: '03',
      icon: 'bi-graph-up-arrow',
      title: 'Track Your Progress',
      description: 'Move tasks, monitor progress and complete your goals.'
    }
  ];

  return (
    <section className="how-section py-5" id="how-it-works">

      <div className="container">

        <div className="text-center mb-5">
          <span className="section-label">GET STARTED</span>

          <h2 className="section-title mt-3">
            Three Steps to Better Productivity
          </h2>

          <p className="section-description">
            Getting organized has never been easier.
          </p>
        </div>

        <div className="row g-4">

          {steps.map((step) => (

            <div className="col-md-4" key={step.number}>

              <div className="step-card text-center h-100">

                <div className="step-number">
                  {step.number}
                </div>

                <div className="step-icon">
                  <i className={`bi ${step.icon}`}></i>
                </div>

                <h5 className="fw-bold mt-4">
                  {step.title}
                </h5>

                <p className="text-secondary mb-0">
                  {step.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;