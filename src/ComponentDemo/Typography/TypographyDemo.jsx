import React from 'react';
import Typography from '../../components/Typography';
import ComponentPlayground from '../ComponentPlayground/ComponentPlayground';

const TypographyDemo = () => {
  // Initial configuration
  const initialConfig = {
    variant: 'body-medium',
    paragraph: false,
    element: '',
    children: 'Sample text content',
    className: ''
  };

  // Demo component that handles Typography-specific logic
  const DemoTypography = (config) => {
    return (
      <div style={{ 
        padding: '20px',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #e0e0e0',
        borderRadius: '4px'
      }}>
        <Typography
          variant={config.variant}
          paragraph={config.paragraph}
          element={config.element || undefined}
          className={config.className}
        >
          {config.children}
        </Typography>
      </div>
    );
  };

  // Controls configuration
  const controls = [
    {
      title: 'Typography Properties',
      controls: [
        {
          key: 'variant',
          label: 'Typography Variant',
          type: 'select',
          options: [
            // Body variants
            { value: 'body-small', label: 'Body Small' },
            { value: 'body-small-semibold', label: 'Body Small Semibold' },
            { value: 'body-medium', label: 'Body Medium' },
            { value: 'body-medium-semibold', label: 'Body Medium Semibold' },
            { value: 'body-large', label: 'Body Large' },
            { value: 'body-large-semibold', label: 'Body Large Semibold' },
            
            // Display variants
            { value: 'display-small', label: 'Display Small' },
            { value: 'display-large', label: 'Display Large' },
            
            // Heading variants
            { value: 'h1', label: 'Heading 1' },
            { value: 'h2', label: 'Heading 2' },
            { value: 'h3', label: 'Heading 3' },
            { value: 'h4', label: 'Heading 4' },
            { value: 'h5', label: 'Heading 5' },
            { value: 'h6', label: 'Heading 6' },
            
            // Label variants
            { value: 'labels-extra-small', label: 'Label Extra Small' },
            { value: 'labels-small', label: 'Label Small' },
            { value: 'labels-medium', label: 'Label Medium' },
            { value: 'labels-medium-all-caps', label: 'Label Medium All Caps' },
            { value: 'labels-large', label: 'Label Large' },
            
            // Button variants
            { value: 'button-extra-small', label: 'Button Extra Small' },
            { value: 'button-small', label: 'Button Small' },
            { value: 'button-standard', label: 'Button Standard' },
            
            // Caption variants
            { value: 'caption-standard', label: 'Caption Standard' },
            { value: 'caption-semibold', label: 'Caption Semibold' },
            
            // Legal variants
            { value: 'legal-standard', label: 'Legal Standard' },
            { value: 'legal-semibold', label: 'Legal Semibold' },
            
            // Overline variants
            { value: 'overline-small', label: 'Overline Small' },
            { value: 'overline-medium', label: 'Overline Medium' },
            { value: 'overline-large', label: 'Overline Large' },
            
            // Number variants
            { value: 'number-small', label: 'Number Small' },
            { value: 'number-medium', label: 'Number Medium' },
            { value: 'number-large', label: 'Number Large' },
            
            // Subtitle variants
            { value: 'subtitle-small', label: 'Subtitle Small' },
            { value: 'subtitle-large', label: 'Subtitle Large' }
          ]
        },
        {
          key: 'element',
          label: 'HTML Element Override',
          type: 'select',
          options: [
            { value: '', label: 'Default (auto)' },
            { value: 'div', label: 'div' },
            { value: 'span', label: 'span' },
            { value: 'p', label: 'p' },
            { value: 'h1', label: 'h1' },
            { value: 'h2', label: 'h2' },
            { value: 'h3', label: 'h3' },
            { value: 'section', label: 'section' },
            { value: 'article', label: 'article' }
          ]
        }
      ]
    },
    {
      title: 'Content',
      controls: [
        {
          key: 'children',
          label: 'Text Content',
          type: 'textarea',
          placeholder: 'Enter your text content here...'
        },
        {
          key: 'className',
          label: 'Additional CSS Classes',
          type: 'text',
          placeholder: 'Enter additional CSS classes'
        }
      ]
    },
    {
      title: 'Layout Options',
      toggles: [
        { key: 'paragraph', label: 'Paragraph Spacing (uses <p> tag)' }
      ]
    }
  ];

  // Generate code function
  const generateCode = (config) => {
    const props = [];
    
    // Add variant if not default
    if (config.variant !== 'body-medium') {
      props.push(`variant="${config.variant}"`);
    }
    
    // Add paragraph if true
    if (config.paragraph) {
      props.push('paragraph');
    }
    
    // Add element if provided
    if (config.element) {
      props.push(`element="${config.element}"`);
    }
    
    // Add className if provided
    if (config.className) {
      props.push(`className="${config.className}"`);
    }
    
    const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    const children = config.children || 'Sample text content';
    
    return `<Typography${propsString}>${children.length > 50 ? '\n  ' + children + '\n' : children}</Typography>`;
  };

  // Example configurations
  const examples = [
    {
      props: {
        variant: 'display-large',
        children: 'Hero Title'
      },
      code: `<Typography variant="display-large">
  Hero Title
</Typography>`
    },
    {
      props: {
        variant: 'h1',
        children: 'Page Heading'
      },
      code: `<Typography variant="h1">
  Page Heading
</Typography>`
    },
    {
      props: {
        variant: 'body-large',
        paragraph: true,
        children: 'This is a paragraph of text with proper spacing above and below.'
      },
      code: `<Typography variant="body-large" paragraph>
  This is a paragraph of text with proper spacing above and below.
</Typography>`
    },
    {
      props: {
        variant: 'body-medium',
        children: 'Inline text without spacing'
      },
      code: `<Typography variant="body-medium">
  Inline text without spacing
</Typography>`
    },
    {
      props: {
        variant: 'labels-medium',
        children: 'Form Label'
      },
      code: `<Typography variant="labels-medium">
  Form Label
</Typography>`
    },
    {
      props: {
        variant: 'button-standard',
        children: 'Button Text'
      },
      code: `<Typography variant="button-standard">
  Button Text
</Typography>`
    },
    {
      props: {
        variant: 'caption-standard',
        children: 'Image caption or helper text'
      },
      code: `<Typography variant="caption-standard">
  Image caption or helper text
</Typography>`
    },
    {
      props: {
        variant: 'legal-semibold',
        children: '5'
      },
      code: `<Typography variant="legal-semibold">
  5
</Typography>`
    },
    {
      props: {
        variant: 'overline-medium',
        children: 'SECTION HEADER'
      },
      code: `<Typography variant="overline-medium">
  SECTION HEADER
</Typography>`
    },
    {
      props: {
        variant: 'number-large',
        children: '$1,234'
      },
      code: `<Typography variant="number-large">
  $1,234
</Typography>`
    }
  ];

  return (
    <ComponentPlayground
      title="Typography Playground"
      description="Explore all typography variants and test the paragraph spacing option. See how different variants render as different HTML elements and experiment with custom content and styling."
      component={DemoTypography}
      controls={controls}
      examples={examples}
      generateCode={generateCode}
      initialConfig={initialConfig}
    />
  );
};

export default TypographyDemo;