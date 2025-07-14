// Survey data structure
const surveyData = {
    goal: "",
    age: "",
    height: "",
    weight: "",
    trainingDays: "",
    equipment: "",
    restrictions: "",
    mealPlan: "",
    dislikes: "",
    fullName: "",
    email: "",
    phone: "",
  }
  
  // Survey state
  let currentStep = 0
  const totalSteps = 10
  
  // Survey questions and options
  const surveySteps = [
    {
      title: "What's your main goal?",
      description: "Select the primary reason you want to start your fitness journey.",
      type: "radio",
      field: "goal",
      options: ["Fat loss", "Muscle gain", "General health", "Other"],
    },
    {
      title: "Tell us about yourself",
      description: "We need some basic information to create your personalized plan.",
      type: "inputs",
      fields: [
        { field: "age", label: "Age", type: "number", placeholder: "Enter your age" },
        { field: "height", label: "Height (in feet/inches or cm)", type: "text", placeholder: "e.g., 5'8\" or 173cm" },
        { field: "weight", label: "Weight (lbs or kg)", type: "text", placeholder: "e.g., 150 lbs or 68 kg" },
      ],
    },
    {
      title: "How many days per week can you train?",
      description: "Be realistic about your schedule and commitments.",
      type: "radio",
      field: "trainingDays",
      options: ["1-2 days", "3-4 days", "5-6 days", "7 days"],
    },
    {
      title: "What equipment do you have access to?",
      description: "This helps us design workouts that fit your setup.",
      type: "textarea",
      field: "equipment",
      placeholder: "e.g., Full gym, Home gym with dumbbells, Bodyweight only, Resistance bands, etc.",
    },
    {
      title: "Do you have any injuries or dietary restrictions?",
      description: "Please share any limitations we should consider in your plan.",
      type: "textarea",
      field: "restrictions",
      placeholder: "e.g., Lower back injury, Vegetarian, Gluten intolerance, None, etc.",
    },
    {
      title: "Do you prefer a simple or more varied meal plan?",
      description: "Choose what works best for your lifestyle and preferences.",
      type: "radio",
      field: "mealPlan",
      options: [
        "Simple - Same meals repeated",
        "Moderate - Some variety with rotation",
        "Varied - Different meals every day",
        "Very varied - Maximum diversity",
      ],
    },
    {
      title: "Any foods or workouts you hate?",
      description: "Let us know what to avoid in your personalized plan.",
      type: "textarea",
      field: "dislikes",
      placeholder: "e.g., Hate burpees, Don't like fish, Avoid running, No Brussels sprouts, etc.",
    },
    {
      title: "What's your full name?",
      description: "We'll use this to personalize your fitness plan.",
      type: "input",
      field: "fullName",
      inputType: "text",
      placeholder: "Enter your full name",
    },
    {
      title: "What's your email address?",
      description: "We'll send your personalized plan and updates here.",
      type: "input",
      field: "email",
      inputType: "email",
      placeholder: "Enter your email address",
    },
    {
      title: "What's your phone number?",
      description: "Optional: For important updates about your fitness journey.",
      type: "input",
      field: "phone",
      inputType: "tel",
      placeholder: "Enter your phone number",
    },
  ]
  
  // DOM elements
  const surveyContent = document.getElementById("survey-content")
  const currentStepElement = document.getElementById("current-step")
  const progressFill = document.getElementById("progress-fill")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const loadingScreen = document.getElementById("loading-screen")
  const resultsScreen = document.getElementById("results-screen")
  const resultsContent = document.getElementById("results-content")
  
  // Initialize survey
  function initSurvey() {
    renderStep()
    updateProgress()
    updateNavigation()
  }
  
  // Render current step
  function renderStep() {
    const step = surveySteps[currentStep]
    let html = `
          <div class="step active">
              <h2>${step.title}</h2>
              <p>${step.description}</p>
      `
  
    switch (step.type) {
      case "radio":
        html += `<div class="radio-group">`
        step.options.forEach((option, index) => {
          const isSelected = surveyData[step.field] === option
          html += `
                      <div class="radio-option ${isSelected ? "selected" : ""}" onclick="selectRadio('${step.field}', '${option}')">
                          <input type="radio" name="${step.field}" value="${option}" ${isSelected ? "checked" : ""}>
                          <label>${option}</label>
                      </div>
                  `
        })
        html += `</div>`
        break
  
      case "input":
        html += `
                  <div class="form-group">
                      <label class="form-label">${step.title}</label>
                      <input type="${step.inputType}" class="form-input" 
                             placeholder="${step.placeholder}" 
                             value="${surveyData[step.field]}"
                             onchange="updateSurveyData('${step.field}', this.value)">
                  </div>
              `
        break
  
      case "inputs":
        html += `<div class="input-grid">`
        step.fields.forEach((field) => {
          html += `
                      <div class="form-group">
                          <label class="form-label">${field.label}</label>
                          <input type="${field.type}" class="form-input" 
                                 placeholder="${field.placeholder}" 
                                 value="${surveyData[field.field]}"
                                 onchange="updateSurveyData('${field.field}', this.value)">
                      </div>
                  `
        })
        html += `</div>`
        break
  
      case "textarea":
        html += `
                  <div class="form-group">
                      <textarea class="form-textarea" 
                                placeholder="${step.placeholder}"
                                onchange="updateSurveyData('${step.field}', this.value)">${surveyData[step.field]}</textarea>
                  </div>
              `
        break
    }
  
    html += `</div>`
    surveyContent.innerHTML = html
  }
  
  // Update survey data
  function updateSurveyData(field, value) {
    surveyData[field] = value
    updateNavigation()
  }
  
  // Select radio option
  function selectRadio(field, value) {
    surveyData[field] = value
    renderStep()
    updateNavigation()
  }
  
  // Update progress bar and step counter
  function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100
    progressFill.style.width = `${progress}%`
    currentStepElement.textContent = currentStep + 1
    document.querySelector(".progress-percent").textContent = `${Math.round(progress)}% Complete`
  }
  
  // Update navigation buttons
  function updateNavigation() {
    prevBtn.disabled = currentStep === 0
  
    const isValid = isStepValid()
    nextBtn.disabled = !isValid
  
    if (currentStep === totalSteps - 1) {
      nextBtn.innerHTML = `
              Generate My Plan
              <span class="btn-icon">✓</span>
          `
    } else {
      nextBtn.innerHTML = `
              Next
              <span class="btn-icon">→</span>
          `
    }
  }
  
  // Validate current step
  function isStepValid() {
    const step = surveySteps[currentStep]
  
    switch (step.type) {
      case "radio":
        return surveyData[step.field] !== ""
      case "input":
        return surveyData[step.field] !== ""
      case "inputs":
        return step.fields.every((field) => surveyData[field.field] !== "")
      case "textarea":
        return surveyData[step.field] !== ""
      default:
        return false
    }
  }
  
  // Navigate to previous step
  function previousStep() {
    if (currentStep > 0) {
      currentStep--
      renderStep()
      updateProgress()
      updateNavigation()
    }
  }
  
  // Navigate to next step or submit
  function nextStep() {
    if (currentStep < totalSteps - 1) {
      currentStep++
      renderStep()
      updateProgress()
      updateNavigation()
    } else {
      submitSurvey()
    }
  }
  
  // Submit survey
  async function submitSurvey() {
    // Show loading screen
    document.querySelector(".survey-card").style.display = "none"
    loadingScreen.classList.remove("hidden")
  
    // Remove logging of sensitive data
    // console.log("Survey data prepared:", surveyData)
  
    try {
        // Get webhook URL from config
        const webhookUrl = window.FITNESS_SURVEY_CONFIG?.webhookUrl;
    
        if (!webhookUrl || webhookUrl === '' || webhookUrl === '__FITNESS_SURVEY_WEBHOOK_URL__') {
            console.warn("Using demo plan - Webhook URL not configured");
            throw new Error("Webhook URL not configured. Please set FitnessSurveyWebhookURL in your .env file and run the build script.");
        }
    
        // Remove logging of sensitive data
        // console.log("Attempting to send request to webhook:", webhookUrl)
    
        // Format data for n8n webhook - flat object as n8n expects
        const webhookData = {
            ...surveyData,
            timestamp: new Date().toISOString(),
            source: "FitnessSurvey"
        };
    
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(webhookData),
        })
    
        if (!response.ok) {
            console.error(`Webhook request failed with status: ${response.status}`)
            const errorText = await response.text()
            console.error("Error response:", errorText)
            throw new Error(`Webhook request failed with status: ${response.status} - ${errorText}`)
        }
    
        // Read response as text first for debugging
        const responseText = await response.text();
        // Remove logging of sensitive data
        // console.log("Raw webhook response text:", responseText);
    
        // Try to parse the response as JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("Failed to parse webhook response as JSON:", jsonError);
            throw new Error(`Webhook response was not valid JSON. Response text: ${responseText.substring(0, 200)}...`);
        }
    
        // Remove logging of sensitive data
        // console.log("Parsed webhook response:", result)
    
        // Expecting webhook to return an array like: [{"output":{"state":"<html1>"}}, {"output":{"state":"<html2>"}}]
        let finalHtmlContent = '';
    
        if (Array.isArray(result)) {
            // Remove logging of sensitive data
            // console.log("Processing webhook response array...");
            // Iterate through each item in the array
            result.forEach((item, index) => {
                // Remove logging of sensitive data
                // console.log(`Processing item at index ${index}:`, item);
                // Check if the nested output.state structure exists and contains a string
                if (item && typeof item === 'object' && item.output && typeof item.output === 'object' && item.output.state && typeof item.output.state === 'string') {
                    // Remove logging of sensitive data
                    // console.log(`Found valid output.state at index ${index}:`, item.output.state.substring(0, 100) + '...'); // Log a snippet
                    finalHtmlContent += item.output.state;
                } else {
                    console.warn("Skipping item in webhook response due to unexpected structure or missing content at index", index, ":", item);
                }
            });
        } else {
            console.error("Unexpected webhook response format: Expected an array.", result);
            throw new Error("Unexpected webhook response format: Expected an array.");
        }
    
        // Check if we successfully extracted and concatenated HTML content
        if (finalHtmlContent) {
            showResults(finalHtmlContent);
        } else {
            console.error("No valid HTML content found or extracted from webhook response array.", result);
            throw new Error("No valid HTML content found or extracted from webhook response array.");
        }
    } catch (error) {
        console.error("Error details:", error)
        console.log("Using demo plan due to error:", error)
    
        // Show demo plan when webhook is not configured or fails
        const demoHtml = `
            <div style="margin-bottom: 32px;">
                <div style="background: linear-gradient(135deg, #dbeafe, #ede9fe); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                    <h2 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 16px;">Your Personalized Fitness & Nutrition Plan</h2>
                    <p style="color: #374151;">Hello ${surveyData.fullName}! Based on your responses, we've created a customized plan for your ${surveyData.goal.toLowerCase()} goal.</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 24px;">
                    <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: #3b82f6; margin-bottom: 16px;">🏋️ Workout Plan</h3>
                        <div style="margin-bottom: 12px;">
                            <p><strong>Training Frequency:</strong> ${surveyData.trainingDays}</p>
                            <p><strong>Equipment:</strong> ${surveyData.equipment}</p>
                        </div>
                        <div style="background: #dbeafe; padding: 16px; border-radius: 8px;">
                            <h4 style="font-weight: 500; margin-bottom: 8px;">Sample Week:</h4>
                            <ul style="font-size: 0.875rem; margin-left: 16px;">
                                <li>Monday: Upper Body Strength</li>
                                <li>Wednesday: Lower Body Power</li>
                                <li>Friday: Full Body Circuit</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: #8b5cf6; margin-bottom: 16px;">🥗 Nutrition Plan</h3>
                        <div style="margin-bottom: 12px;">
                            <p><strong>Meal Style:</strong> ${surveyData.mealPlan}</p>
                            <p><strong>Restrictions:</strong> ${surveyData.restrictions || "None specified"}</p>
                        </div>
                        <div style="background: #ede9fe; padding: 16px; border-radius: 8px;">
                            <h4 style="font-weight: 500; margin-bottom: 8px;">Daily Structure:</h4>
                            <ul style="font-size: 0.875rem; margin-left: 16px;">
                                <li>Breakfast: Protein + Complex Carbs</li>
                                <li>Lunch: Lean Protein + Vegetables</li>
                                <li>Dinner: Balanced Macro Split</li>
                            </ul>
                        </div>
                    </div>
                </div>
            
                <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 16px; border-radius: 8px;">
                    <p style="font-size: 0.875rem; color: #92400e;">
                        <strong>Demo Mode:</strong> This is a sample plan. Configure your webhook URL in your .env file and run the build script to generate AI-powered personalized plans.
                    </p>
                </div>
            </div>
        `
    
        showResults(demoHtml)
    }
  }
  
  // Show results screen
  function showResults(htmlContent) {
    loadingScreen.classList.add("hidden")
    resultsContent.innerHTML = htmlContent
    resultsScreen.classList.remove("hidden")
  }
  
  // Event listeners
  prevBtn.addEventListener("click", previousStep)
  nextBtn.addEventListener("click", nextStep)
  
  // Initialize the survey when page loads
  document.addEventListener("DOMContentLoaded", initSurvey)
  