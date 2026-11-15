import React from 'react';

function Benefits() {

  const benefits = [
    'Keep all your tasks organized in one place.',
    'Understand what needs attention first.',
    'Monitor deadlines and task progress.',
    'Manage multiple projects independently.',
    'Access your workspace across different devices.'
  ];

  return (
    <section className="benefits-section py-5" id="benefits">

      <div className="container">

        <div className="row align-items-center g-5">

          <div className="col-lg-6">

            <span className="section-label">WHY TASKFLOW?</span>

            <h2 className="section-title mt-3">
              Less Confusion.
              <br />
              More Productivity.
            </h2>

            <p className="text-secondary mt-3">
              TaskFlow gives you a clear view of your work,
              helping you organize tasks and focus on what
              matters most.
            </p>

            <div className="mt-4">

              {benefits.map((benefit, index) => (

                <div className="benefit-item" key={index}>
                  <i className="bi bi-check-circle-fill text-success me-3"></i>
                  {benefit}
                </div>

              ))}

            </div>

          </div>

          <div className="col-lg-6">

            <div className="benefit-visual">

              <div className="benefit-main-card">

                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold">Your Workflow</h5>
                  <i className="bi bi-activity text-primary fs-3"></i>
                </div>

                <div className="benefit-workflow mt-4">

                  <div className="workflow-item">
                    <span className="workflow-icon bg-primary-subtle text-primary">
                      <i className="bi bi-pencil-square"></i>
                    </span>
                    <div>
                      <h6 className="mb-1">Plan your work</h6>
                      <small className="text-secondary">Organize your priorities</small>
                    </div>
                  </div>

                  <div className="workflow-item">
                    <span className="workflow-icon bg-warning-subtle text-warning">
                      <i className="bi bi-arrow-repeat"></i>
                    </span>
                    <div>
                      <h6 className="mb-1">Manage your tasks</h6>
                      <small className="text-secondary">Keep everything moving</small>
                    </div>
                  </div>

                  <div className="workflow-item">
                    <span className="workflow-icon bg-success-subtle text-success">
                      <i className="bi bi-check2-circle"></i>
                    </span>
                    <div>
                      <h6 className="mb-1">Achieve your goals</h6>
                      <small className="text-secondary">Track your accomplishments</small>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Benefits;