// src/components/Typography/Typography.jsx
import React from 'react';
import PropTypes from 'prop-types';

// Map variants to their CSS class names (matching your existing typography.css)
const variantClassMap = {
  'body-small': 'Body-Small',
  'body-small-semibold': 'Body-Small-Semibold',
  'body-medium': 'Body-Medium',
  'body-medium-semibold': 'Body-Medium-Semibold',
  'body-large': 'Body-Large',
  'body-large-semibold': 'Body-Large-Semibold',
  'button-extra-small': 'Buttons-Extra-Small',
  'button-small': 'Buttons-Small',
  'button-standard': 'Buttons-Standard',
  'caption-standard': 'Captions-Standard',
  'caption-semibold': 'Captions-Bold',
  'display-small': 'Display-Small',
  'display-large': 'Display-Large',
  'h1': '', // Uses native h1 styling from your CSS
  'h2': '', // Uses native h2 styling from your CSS
  'h3': '', // Uses native h3 styling from your CSS
  'h4': '', // Uses native h4 styling from your CSS
  'h5': '', // Uses native h5 styling from your CSS
  'h6': '', // Uses native h6 styling from your CSS
  'labels-extra-small': 'Extra-Small',
  'labels-small': 'Small',
  'labels-medium': '', // Uses base label styling
  'labels-medium-all-caps': 'Medium-All-Caps',
  'labels-large': 'Large',
  'legal-standard': 'Legal-Standard',
  'legal-semibold': 'Legal-Semibold',
  'overline-small': 'Overline-Small',
  'overline-medium': 'Overline-Medium',
  'overline-large': 'Overline-Large',
  'number-small': 'Number-Small',
  'number-medium': 'Number-Medium',
  'number-large': 'Number-Large',
  'subtitle-small': 'Subtitles-Small',
  'subtitle-large': 'Subtitles-Large'
};

// Map variants to their default HTML elements (when paragraph=false)
const variantElementMap = {
  'body-small': 'span',
  'body-small-semibold': 'span',
  'body-medium': 'span',
  'body-medium-semibold': 'span',
  'body-large': 'span',
  'body-large-semibold': 'span',
  'button-extra-small': 'span',
  'button-small': 'span',
  'button-standard': 'span',
  'caption-standard': 'span',
  'caption-semibold': 'span',
  'display-small': 'h1',
  'display-large': 'h1',
  'h1': 'h1',
  'h2': 'h2',
  'h3': 'h3',
  'h4': 'h4',
  'h5': 'h5',
  'h6': 'h6',
  'labels-extra-small': 'label',
  'labels-small': 'label',
  'labels-medium': 'label',
  'labels-medium-all-caps': 'label',
  'labels-large': 'label',
  'legal-standard': 'span',
  'legal-semibold': 'span',
  'overline-small': 'span',
  'overline-medium': 'span',
  'overline-large': 'span',
  'number-small': 'span',
  'number-medium': 'span',
  'number-large': 'span',
  'subtitle-small': 'h2',
  'subtitle-large': 'h2'
};

// Variants that should never change element regardless of paragraph setting
const semanticVariants = [
  'display-small', 'display-large',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'labels-extra-small', 'labels-small', 'labels-medium', 'labels-medium-all-caps', 'labels-large',
  'subtitle-small', 'subtitle-large'
];

// All available typography variants
export const typographyVariants = [
  'body-small',
  'body-small-semibold',
  'body-medium',
  'body-medium-semibold',
  'body-large',
  'body-large-semibold',
  'button-extra-small',
  'button-small',
  'button-standard',
  'caption-standard',
  'caption-semibold',
  'display-small',
  'display-large',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'labels-extra-small',
  'labels-small',
  'labels-medium',
  'labels-medium-all-caps',
  'labels-large',
  'legal-standard',
  'legal-semibold',
  'overline-small',
  'overline-medium',
  'overline-large',
  'number-small',
  'number-medium',
  'number-large',
  'subtitle-small',
  'subtitle-large'
];

/**
 * Typography component for consistent text styling across the application
 * Uses your existing typography.css classes and design system
 * 
 * @example
 * // Inline text (default - no spacing)
 * <Typography variant="body-medium">Inline text</Typography>
 * 
 * // Paragraph text (with spacing)
 * <Typography variant="body-medium" paragraph>
 *   This text will have paragraph margins for proper spacing between blocks of text.
 * </Typography>
 * 
 * // Headings and labels (always use semantic elements)
 * <Typography variant="h1">Page Title</Typography>
 * <Typography variant="labels-medium">Form Label</Typography>
 * 
 * // Custom element override
 * <Typography variant="body-large" element="div">
 *   This renders as a div regardless of paragraph setting
 * </Typography>
 */
function Typography({
  variant = 'body-medium',
  paragraph = false,
  element,
  children,
  className = '',
  ...props
}) {
  // Determine the HTML element to use
  let Element;
  
  if (element) {
    // User explicitly specified an element
    Element = element;
  } else if (semanticVariants.includes(variant)) {
    // Semantic elements always use their proper tags
    Element = variantElementMap[variant];
  } else if (paragraph) {
    // Use <p> for paragraph spacing
    Element = 'p';
  } else {
    // Use default element (usually span for inline)
    Element = variantElementMap[variant] || 'span';
  }
  
  // Get the CSS class for this variant
  const variantClass = variantClassMap[variant];
  
  // Build CSS classes - only add variant class if it exists
  const classes = [
    variantClass || '', // Use the existing CSS class from your typography.css
    className
  ].filter(Boolean).join(' ');

  return (
    <Element className={classes} {...props}>
      {children}
    </Element>
  );
}

Typography.propTypes = {
  /** Typography variant to apply */
  variant: PropTypes.oneOf(typographyVariants),
  /** Whether to render as paragraph with spacing (uses <p> tag) */
  paragraph: PropTypes.bool,
  /** HTML element to render (overrides paragraph and default mapping) */
  element: PropTypes.string,
  /** Content to display */
  children: PropTypes.node.isRequired,
  /** Additional CSS class names */
  className: PropTypes.string
};

export default Typography;