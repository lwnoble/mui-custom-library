import React from 'react';
import { Badge } from '../../components/Badge/Badge.jsx';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground.jsx';

const BadgeDemo = () => {
  // Initial configuration
  const initialConfig = {
    type: 'counter',
    state: 'info',
    text: '1'
  };

  // Enhanced demo component that handles Badge-specific logic and auto-updates
  const DemoBadge = (config) => {
    // Auto-update text content based on type changes
    const getAutoUpdatedContent = () => {
      switch (config.type) {
        case 'counter':
          // If text is empty or still default, use appropriate counter text
          if (!config.text || config.text === '') {
            return '1';
          }
          return config.text;
        case 'status':
          // Status badges typically don't show text, but allow override
          return config.text || '';
        default:
          return config.text || '1';
      }
    };

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px',
        minHeight: '120px',
        width: '100%'
      }}>
        <Badge
          type={config.type}
          state={config.state}
          text={getAutoUpdatedContent()}
        />
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Badge Properties',
      controls: [
        {
          key: 'type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'counter', label: 'Counter' },
            { value: 'status', label: 'Status' }
          ]
        },
        {
          key: 'state',
          label: 'State',
          type: 'select',
          options: [
            { value: 'info', label: 'Info' },
            { value: 'success', label: 'Success' },
            { value: 'warning', label: 'Warning' },
            { value: 'error', label: 'Error' }
          ]
        }
      ]
    },
    {
      title: 'Content',
      controls: [
        {
          key: 'text',
          label: 'Badge Text',
          type: 'text',
          placeholder: (config) => {
            switch (config.type) {
              case 'counter': return 'Enter number or text (e.g., 1, 99+, NEW)';
              case 'status': return 'Leave empty for status indicator only';
              default: return 'Enter badge text';
            }
          }
        }
      ]
    }
  ];

  // Generate code function
  const generateCode = (config) => {
    const props = [];
    
    // Add type if not default
    if (config.type !== 'counter') {
      props.push(`type="${config.type}"`);
    }
    
    // Add state if not default
    if (config.state !== 'info') {
      props.push(`state="${config.state}"`);
    }
    
    // Add text if provided and not default
    const text = config.text || (config.type === 'counter' ? '1' : '');
    if (text && text !== '1') {
      props.push(`text="${text}"`);
    }
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    
    return `<Badge${propsString} />`;
  };

  // Example configurations
  const examples = [
    {
      props: {
        type: 'counter',
        state: 'info',
        text: '1'
      },
      code: `<Badge />`
    },
    {
      props: {
        type: 'counter',
        state: 'success',
        text: '5'
      },
      code: `<Badge 
  state="success"
  text="5"
/>`
    },
    {
      props: {
        type: 'counter',
        state: 'warning',
        text: '99+'
      },
      code: `<Badge 
  state="warning"
  text="99+"
/>`
    },
    {
      props: {
        type: 'counter',
        state: 'error',
        text: '!'
      },
      code: `<Badge 
  state="error"
  text="!"
/>`
    },
    {
      props: {
        type: 'status',
        state: 'info'
      },
      code: `<Badge 
  type="status"
  state="info"
/>`
    },
    {
      props: {
        type: 'status',
        state: 'success'
      },
      code: `<Badge 
  type="status"
  state="success"
/>`
    },
    {
      props: {
        type: 'status',
        state: 'warning'
      },
      code: `<Badge 
  type="status"
  state="warning"
/>`
    },
    {
      props: {
        type: 'status',
        state: 'error'
      },
      code: `<Badge 
  type="status"
  state="error"
/>`
    },
    {
      props: {
        type: 'counter',
        state: 'info',
        text: 'NEW'
      },
      code: `<Badge 
  text="NEW"
/>`
    },
    {
      props: {
        type: 'counter',
        state: 'success',
        text: 'BETA'
      },
      code: `<Badge 
  state="success"
  text="BETA"
/>`
    }
  ];

  return (
    <ComponentPlayground
      title="Badge Playground"
      description="Customize badge properties and see all types and states. Counter badges display text or numbers, while status badges show colored indicators. Perfect for notifications, labels, and status indicators."
      component={DemoBadge}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default BadgeDemo;