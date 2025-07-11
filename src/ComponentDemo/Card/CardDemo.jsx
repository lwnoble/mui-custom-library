import React, { useState } from 'react';
import { Star, Heart, BookOpen, Settings, ArrowRight, User } from 'lucide-react';
import Card from '../../components/Card/Card';


const CardDemo = () => {
  const [clickCounts, setClickCounts] = useState({});

  const handleCardClick = (cardId) => {
    setClickCounts(prev => ({
      ...prev,
      [cardId]: (prev[cardId] || 0) + 1
    }));
  };

  const variants = ['elevated', 'outlined', 'filled'];
  const states = ['default', 'hover', 'focus', 'focus-visible', 'disabled'];

  const renderStateRow = (variant, cardType) => {
    const baseId = `${variant}-${cardType}`;

    return (
      <div key={baseId} className="states-row">
        <div className="state-label">
          <strong>{variant}</strong>
          <div className="size-type">{cardType}</div>
        </div>
        
        {states.map(state => (
          <div key={state} className="state-demo">
            <label>{state}</label>
            <Card
              variant={variant}
              clickable={cardType === 'clickable'}
              disabled={state === 'disabled'}
              className={state === 'default' ? '' : `force-${state}-state`}
              onClick={cardType === 'clickable' ? () => handleCardClick(`${baseId}-${state}`) : undefined}
            >
              <div className="demo-card-content">
                <div className="demo-card-header">
                  <Star size={16} />
                  <span>Card Title</span>
                </div>
                <p>This is a {variant} {cardType} card showing the {state} state.</p>
                {cardType === 'clickable' && (
                  <div className="demo-card-footer">
                    <span>Click me!</span>
                    <ArrowRight size={12} />
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  const cardTypes = ['static', 'clickable'];

  return (
    <div className="states-demo">
      <div className="demo-header">
        <h1>Card States Demo</h1>
        <p>Comprehensive demonstration of all card variants, types, and states</p>
      </div>

      <div className="state-definitions">
        <div className="definition">
          <strong>Default:</strong> Normal resting state
        </div>
        <div className="definition">
          <strong>Hover:</strong> Mouse over interaction (clickable only)
        </div>
        <div className="definition">
          <strong>Focus:</strong> Keyboard navigation focus (clickable only)
        </div>
        <div className="definition">
          <strong>Focus-Visible:</strong> Visible focus indicator (clickable only)
        </div>
        <div className="definition">
          <strong>Disabled:</strong> Non-interactive state (clickable only)
        </div>
      </div>

      <div className="demo-section">
        <h2>All Card Variants and States</h2>
        <div className="states-grid">
          {variants.map(variant => 
            cardTypes.map(type => renderStateRow(variant, type))
          )}
        </div>
      </div>

      <div className="demo-section">
        <h2>Interactive Examples</h2>
        <p>Try interacting with these cards to see natural state changes:</p>
        <div className="interactive-demo">
          <Card variant="elevated" clickable onClick={() => alert('Profile clicked!')}>
            <div className="example-card-content">
              <div className="example-card-header">
                <User size={20} />
                <h3>User Profile</h3>
              </div>
              <p>Click to view profile details and settings.</p>
              <div className="example-card-actions">
                <span>View Profile</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Card>

          <Card variant="outlined" clickable onClick={() => alert('Favorites clicked!')}>
            <div className="example-card-content">
              <div className="example-card-header">
                <Heart size={20} />
                <h3>Favorites</h3>
              </div>
              <p>Manage your favorite items and collections.</p>
              <div className="example-card-actions">
                <span>Manage</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Card>

          <Card variant="filled" clickable onClick={() => alert('Reading list clicked!')}>
            <div className="example-card-content">
              <div className="example-card-header">
                <BookOpen size={20} />
                <h3>Reading List</h3>
              </div>
              <p>Continue reading from where you left off.</p>
              <div className="example-card-actions">
                <span>Continue Reading</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="example-card-content">
              <div className="example-card-header">
                <Settings size={20} />
                <h3>Static Card</h3>
              </div>
              <p>This card displays information but is not interactive.</p>
              <div className="example-card-info">
                <span>Information only</span>
              </div>
            </div>
          </Card>

          <Card variant="outlined" clickable disabled>
            <div className="example-card-content">
              <div className="example-card-header">
                <Settings size={20} />
                <h3>Disabled Card</h3>
              </div>
              <p>This card is disabled and cannot be interacted with.</p>
              <div className="example-card-actions">
                <span>Unavailable</span>
              </div>
            </div>
          </Card>

          <Card variant="filled" href="https://example.com" target="_blank">
            <div className="example-card-content">
              <div className="example-card-header">
                <BookOpen size={20} />
                <h3>Link Card</h3>
              </div>
              <p>This card functions as a link to an external resource.</p>
              <div className="example-card-actions">
                <span>Visit Link</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="demo-section">
        <h2>Click Counter</h2>
        <p>Interactive cards clicked:</p>
        <div className="click-counter">
          {Object.entries(clickCounts).map(([cardId, count]) => (
            <div key={cardId} className="counter-item">
              <strong>{cardId}:</strong> {count} clicks
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardDemo;