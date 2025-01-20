export function sidebarAccordion(e: any) {
  try {
    // Get the sibling element
    let sibling = e.currentTarget.nextSibling;
    // Check if the sibling element exists and is valid
    if (sibling) {
      // Get the height of the sibling element    
      let getHeight = sibling.scrollHeight;
      // Check if the style attribute is set
      if (!sibling.getAttribute("style")) {
        // Set the height of the sibling element
        sibling.style.height = `${getHeight}px`;
        // sibling.style.height = 'full'; 
      } else {
        // Remove the style attribute to reset the height
        sibling.removeAttribute("style");
      }
    } else {
      // Show an error message if the sibling element is not found or invalid
      console.error("Sibling element not found or invalid.");
    }
  } catch (error) {
    // Log an error message if an exception occurs
    console.error("An error occurred:", error);
  }
}