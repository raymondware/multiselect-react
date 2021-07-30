import React from 'react'

const ConditionalDisplay = ({ display = true, children }) => {
  if (!display) {
    return null;
  }
  
  return (<>
    {children}  
  </>)
}

export default ConditionalDisplay
