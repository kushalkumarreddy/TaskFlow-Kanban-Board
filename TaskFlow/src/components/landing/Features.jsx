import React from 'react';

function Features() {

  const features = [
    {
      icon: 'bi-kanban',
      title: 'Visual Kanban Boards',
      description: 'Organize tasks into columns and easily track every stage of your workflow.',
      color: 'primary'
    },
    {
      icon: 'bi-check2-square',
      title: 'Task Management',
      description: 'Create, edit and manage tasks with priorities, categories and deadlines.',
      color: 'success'
    },
    {
      icon: 'bi-calendar-event',
      title: 'Deadline Tracking',
      description: 'Keep track of upcoming deadlines and never lose sight of important work.',
      color: 'warning'
    },
    {
      icon: 'bi-search',
      title: 'Smart Search',
      description: 'Find tasks quickly using search, priority and category filters.',
      color: 'info'
    },
    {
      icon: 'bi-graph-up-arrow',
      title: 'Progress Tracking',
      description: 'Understand your productivity through task statistics and completion progress.',
      color: 'danger'
    },
    {
      icon: 'bi-clock-history',
      title: 'Activity History',
      description: 'Review important changes and follow your task management history.',
      color: 'primary'
    }
  ];

  return (
    <section className="features-section py-5" id="features">

      <div className="container">

        <div className="text-center mb-5">
          <span className="section-label">POWERFUL FEATURES</span>

          <h2 className="section-title mt-3">
            Everything You Need to Stay Productive
          </h2>

          <p className="section-description">
            Simple tools designed to make your everyday work easier.
          </p>
        </div>

        <div className="row g-4">

          {features.map((feature, index) => (

            <div className="col-md-6 col-lg-4" key={index}>

              <div className="feature-card h-100">

                <div className={`feature-icon text-${feature.color}`}>
                  <i className={`bi ${feature.icon}`}></i>
                </div>

                <h5 className="fw-bold mt-4">
                  {feature.title}
                </h5>

                <p className="text-secondary mb-0">
                  {feature.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;