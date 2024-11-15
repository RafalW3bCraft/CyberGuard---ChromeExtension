// Function to show a blocked message and motivational quote
function showBlockedMessage() {
    // Prevent the page content from being accessed
    document.body.innerHTML = '';
  
    // Create a div for the blocked message
    const blockedMessage = document.createElement('div');
    blockedMessage.style.position = 'fixed';
    blockedMessage.style.top = '0';
    blockedMessage.style.left = '0';
    blockedMessage.style.width = '100%';
    blockedMessage.style.height = '100%';
    blockedMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    blockedMessage.style.color = '#fff';
    blockedMessage.style.display = 'flex';
    blockedMessage.style.flexDirection = 'column';
    blockedMessage.style.justifyContent = 'center';
    blockedMessage.style.alignItems = 'center';
    blockedMessage.style.textAlign = 'center';
    blockedMessage.style.fontFamily = 'Arial, sans-serif';
    blockedMessage.style.fontSize = '24px';
    blockedMessage.style.zIndex = '9999';
  
    // Add a motivational quote
    const quotes = [
      "Stay focused and you will achieve great things!",
      "The harder you work for something, the greater you'll feel when you achieve it.",
      "Don't wait for opportunity. Create it.",
      "Success is the sum of small efforts, repeated day in and day out."
    ];
  
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.createElement('p');
    quoteElement.textContent = randomQuote;
    quoteElement.style.marginBottom = '20px';
  
    // Create a redirect button
    const redirectButton = document.createElement('button');
    redirectButton.textContent = 'Go to Your Productive Tasks';
    redirectButton.style.padding = '10px 20px';
    redirectButton.style.backgroundColor = '#007bff';
    redirectButton.style.border = 'none';
    redirectButton.style.borderRadius = '5px';
    redirectButton.style.cursor = 'pointer';
    redirectButton.style.fontSize = '16px';
    redirectButton.style.transition = 'background-color 0.3s';
  
    // Add event listener to the button
    redirectButton.addEventListener('click', () => {
      window.location.href = 'https://your-productive-site.com'; // Customize with your desired URL
    });
  
    // Append elements to the blocked message div
    blockedMessage.appendChild(quoteElement);
    blockedMessage.appendChild(redirectButton);
  
    // Add the blocked message div to the body
    document.body.appendChild(blockedMessage);
  }
  
  // Execute the block message function
  showBlockedMessage();
  