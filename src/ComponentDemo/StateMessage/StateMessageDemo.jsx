import React from 'react';
import { StateMessage } from '../../components/StateMessage';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground.jsx';

const StateMessageDemo = () => {
  // Initial configuration
  const initialConfig = {
    type: 'info',
    withIcon: true,
    customText: '',
    className: ''
  };

  // Enhanced demo component that handles StateMessage-specific logic
  const DemoStateMessage = (config) => {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '60px',
        minHeight: '200px',
        width: '100%'
      }}>
        <StateMessage
          type={config.type}
          withIcon={config.withIcon}
          className={config.className}
        />
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Message Properties',
      controls: [
        {
          key: 'type',
          label: 'Message Type',
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
      title: 'Styling',
      controls: [
        {
          key: 'className',
          label: 'Additional CSS Classes',
          type: 'text',
          placeholder: 'Enter additional CSS classes'
        }
      ]
    },
    {
      title: 'Display Options',
      toggles: [
        { 
          key: 'withIcon', 
          label: 'Show Icon',
          description: 'Display the type-specific icon'
        }
      ]
    }
  ];

  // Generate code function
  const generateCode = (config) => {
    const props = [];
    
    // Add type
    props.push(`type="${config.type}"`);
    
    // Add withIcon if false (since true is default)
    if (!config.withIcon) {
      props.push('withIcon={false}');
    }
    
    // Add className if provided
    if (config.className) {
      props.push(`className="${config.className}"`);
    }
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    
    return `<StateMessage${propsString}/>`;
  };

  // Example configurations
  const examples = [
    {
      props: {
        type: 'success',
        withIcon: true
      },
      code: `<StateMessage type="success" />`
    },
    {
      props: {
        type: 'error',
        withIcon: true
      },
      code: `<StateMessage type="error" />`
    },
    {
      props: {
        type: 'warning',
        withIcon: true
      },
      code: `<StateMessage type="warning" />`
    },
    {
      props: {
        type: 'info',
        withIcon: true
      },
      code: `<StateMessage type="info" />`
    },
    {
      props: {
        type: 'success',
        withIcon: false
      },
      code: `<StateMessage 
  type="success" 
  withIcon={false} 
/>`
    },
    {
      props: {
        type: 'error',
        withIcon: false
      },
      code: `<StateMessage 
  type="error" 
  withIcon={false} 
/>`
    }
  ];

  return (
    <ComponentPlayground
      title="State Message Playground"
      description="Customize state message properties to see different types (success, error, warning, info) with optional icons. Perfect for notifications, alerts, and user feedback."
      component={DemoStateMessage}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default StateMessageDemo;