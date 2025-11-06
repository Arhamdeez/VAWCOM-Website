import { NextRequest, NextResponse } from 'next/server';

// Add GET handler for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Vapi API route is working!', 
    endpoint: '/api/vapi/call',
    method: 'POST',
    requiredBody: { phoneNumber: 'string' }
  });
}

export async function POST(request: NextRequest) {
  console.log('\n\n🚀 ============================================');
  console.log('📞 VAPI CALL API ROUTE HIT!');
  console.log('🚀 ============================================');
  console.log('📍 Request URL:', request.url);
  console.log('📍 Request Method: POST');
  console.log('📍 Timestamp:', new Date().toISOString());
  console.log('============================================\n');
  
  try {
    const body = await request.json().catch(() => {
      console.error('❌ Failed to parse request body');
      return null;
    });
    
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    console.log('📥 Received request body:', body);
    const { phoneNumber } = body;

    // Validate phone number
    if (!phoneNumber || phoneNumber.trim() === '') {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format phone number to E.164 format
    let formattedNumber: string;
    const trimmed = phoneNumber.trim();
    
    // If it already starts with +, clean and validate
    if (trimmed.startsWith('+')) {
      // Remove all non-digit characters except the + at the start
      const digits = trimmed.substring(1).replace(/\D/g, '');
      formattedNumber = '+' + digits;
      
      // Validate E.164 format: + followed by 7-15 digits
      if (formattedNumber.length < 8 || formattedNumber.length > 16) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number in international format (e.g., +12175551234)' },
          { status: 400 }
        );
      }
      
      console.log('📱 Phone number already in E.164 format:', formattedNumber);
    } else {
      // No + prefix, need to format it
      const cleanedNumber = trimmed.replace(/\D/g, '');
      
      // Basic validation - should have at least 7 digits (international minimum)
      if (cleanedNumber.length < 7) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number' },
          { status: 400 }
        );
      }

      // Format based on common patterns - prioritize US/Canada (+1)
      if (cleanedNumber.startsWith('1') && cleanedNumber.length === 11) {
        // US/Canada number with country code already included
        formattedNumber = `+${cleanedNumber}`;
      } else if (cleanedNumber.length === 10) {
        // 10-digit number - assume US/Canada and add +1
        formattedNumber = `+1${cleanedNumber}`;
      } else if (cleanedNumber.startsWith('92') && cleanedNumber.length >= 10) {
        // Pakistan number with country code
        formattedNumber = `+${cleanedNumber}`;
      } else if (cleanedNumber.length === 10 && cleanedNumber.startsWith('0')) {
        // Pakistani number starting with 0 (local format), convert to international
        formattedNumber = `+92${cleanedNumber.substring(1)}`;
      } else {
        // International number without country code prefix - try to detect
        if (cleanedNumber.length === 10) {
          // Default to US for 10-digit numbers
          formattedNumber = `+1${cleanedNumber}`;
        } else {
          formattedNumber = `+${cleanedNumber}`;
        }
      }
      
      console.log('📱 Formatted phone number:', formattedNumber);
    }
    
    // Additional validation for +1 numbers (US/Canada)
    if (formattedNumber.startsWith('+1')) {
      // US/Canada numbers should be +1 followed by exactly 10 digits
      const usNumber = formattedNumber.substring(2);
      if (usNumber.length !== 10) {
        return NextResponse.json(
          { error: 'US/Canada numbers must have 10 digits after +1 (e.g., +12175551234)' },
          { status: 400 }
        );
      }
      // Validate area code (first digit should be 2-9)
      if (usNumber[0] < '2' || usNumber[0] > '9') {
        return NextResponse.json(
          { error: 'Invalid area code. US/Canada area codes must start with 2-9' },
          { status: 400 }
        );
      }
      console.log('✅ Validated US/Canada number:', formattedNumber);
    }
    
    // Additional validation for +92 numbers (Pakistan)
    if (formattedNumber.startsWith('+92')) {
      // Pakistan numbers should be +92 followed by 10 digits (mobile) or 9-10 digits (landline)
      const pkNumber = formattedNumber.substring(3);
      if (pkNumber.length < 9 || pkNumber.length > 10) {
        return NextResponse.json(
          { error: 'Pakistan numbers must have 9-10 digits after +92 (e.g., +923001234567)' },
          { status: 400 }
        );
      }
      // Pakistan mobile numbers start with 3
      if (pkNumber.length === 10 && !pkNumber.startsWith('3')) {
        return NextResponse.json(
          { error: 'Pakistan mobile numbers must start with 3 (e.g., +923001234567)' },
          { status: 400 }
        );
      }
      console.log('✅ Validated Pakistan number:', formattedNumber);
    }

    // Use your Vapi keys (keep these in environment variables)
    const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY || '23a89221-364f-44b5-8e68-e2a5c35117f1';
    const VAPI_PUBLIC_KEY = process.env.VAPI_PUBLIC_KEY || '568b2e0f-ee5b-47d1-8feb-6a9cf7cdc001';
    const VAPI_AGENT_ID = process.env.VAPI_AGENT_ID || 'f0802519-a745-4453-8ee6-35d237f14164';
    // VAPI_PHONE_NUMBER_ID: This is the "FROM" number (caller ID) - the number that will appear on the recipient's phone
    // This can be:
    // 1. A Vapi free phone number ID (created in Vapi dashboard) - FREE, 10 calls/day, US/Canada only
    // 2. A Twilio number ID (imported to Vapi) - may require paid Twilio account for international
    // If not set, Vapi will use a default free number
    const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID?.trim() || '3095e66b-4884-42f2-a94a-ae33e71de9c4';
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ''; // Optional: if Twilio is configured
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ''; // Optional: if Twilio is configured
    
    // Try private key first, fallback to public key
    const VAPI_KEY = VAPI_PRIVATE_KEY || VAPI_PUBLIC_KEY;
    
    console.log('\n📋 Configuration:');
    console.log('   🔑 Using Vapi key:', VAPI_KEY.substring(0, 10) + '...', VAPI_PRIVATE_KEY ? '(private)' : '(public)');
    console.log('   🤖 Agent ID:', VAPI_AGENT_ID || 'Not provided');
    console.log('   📱 TO (destination - number to call):', formattedNumber);
    
    if (VAPI_PHONE_NUMBER_ID) {
      if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
        console.log('   🔵 Twilio Mode: ENABLED');
        console.log('   📞 Phone Number ID (Twilio number in Vapi):', VAPI_PHONE_NUMBER_ID);
        console.log('   💡 Using Twilio number imported to Vapi');
        console.log('   💡 Twilio Account SID:', TWILIO_ACCOUNT_SID.substring(0, 10) + '...');
      } else {
        console.log('   📞 FROM (caller ID - Phone number ID):', VAPI_PHONE_NUMBER_ID);
        console.log('   💡 Using your phone number as caller ID (Twilio or Vapi)');
      }
    } else {
      console.log('   📞 FROM (caller ID): Vapi default FREE US number (10 calls/day limit)');
      console.log('   💡 Using Vapi\'s default free phone numbers - no paid account needed!');
    }
    console.log('');

    // Based on Vapi API responses:
    // 1. Endpoint is: https://api.vapi.ai/call (singular)
    // 2. Must have: assistantId (or assistant, squad, squadId)
    // 3. phoneNumber must be an object (not a string)
    // 4. OR use customer.number format
    
    if (!VAPI_AGENT_ID) {
      return NextResponse.json(
        {
          error: 'Agent ID required',
          message: 'Vapi requires an assistantId. Please add VAPI_AGENT_ID to your .env.local file.',
          details: {
            message: "Couldn't Get Assistant. Need Either `assistant`, `assistantId`, `squad`, Or `squadId`."
          }
        },
        { status: 400 }
      );
    }

    // Prepare request body - based on actual Vapi API requirements
    // Priority: phoneNumberId (Twilio imported) > Twilio direct > default formats
    const requestBodies: Array<Record<string, unknown>> = [];
    
    // PRIORITY 1: If phoneNumberId is provided (Twilio number imported to Vapi or Vapi number)
    // This is the BEST option when you have a Twilio number imported to Vapi
    if (VAPI_PHONE_NUMBER_ID) {
      requestBodies.push(
        // Official Vapi format - phoneNumberId + customer.number + assistantId
        // Works with Twilio numbers imported to Vapi
        {
          assistantId: VAPI_AGENT_ID,
          phoneNumberId: VAPI_PHONE_NUMBER_ID,
          customer: {
            number: formattedNumber, // The number to call (destination)
          },
        }
      );
    }
    // PRIORITY 2: If Twilio credentials are provided but no phoneNumberId, use Twilio directly
    else if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      // Direct Twilio phone number object (without importing to Vapi)
      requestBodies.push(
        {
          assistantId: VAPI_AGENT_ID,
          phoneNumber: {
            number: formattedNumber,
            twilioAccountSid: TWILIO_ACCOUNT_SID,
            twilioAuthToken: TWILIO_AUTH_TOKEN,
          },
        },
        {
          assistantId: VAPI_AGENT_ID,
          phoneNumber: {
            twilioPhoneNumber: formattedNumber,
            twilioAccountSid: TWILIO_ACCOUNT_SID,
            twilioAuthToken: TWILIO_AUTH_TOKEN,
          },
        }
      );
    }
    // PRIORITY 3: Default formats (no phoneNumberId, no Twilio)
    else {
      requestBodies.push(
        // Format 1: phoneNumber as object
        {
          phoneNumber: {
            number: formattedNumber,
          },
          assistantId: VAPI_AGENT_ID,
        },
        // Format 2: With customer object
        {
          customer: {
            number: formattedNumber,
          },
          assistantId: VAPI_AGENT_ID,
        }
      );
    }

    // Use the correct Vapi API endpoint
    const endpoints = [
      'https://api.vapi.ai/call', // Correct endpoint (singular, confirmed)
    ];

    let vapiResponse: Response | null = null;
    let data: Record<string, unknown> | null = null;
    let lastError: { endpoint?: string; status?: number; data?: unknown; error?: string; fullError?: string } | null = null;
    let attemptCount = 0;

    // Try each endpoint with each request body format until one works
    console.log(`🔄 Starting attempts: ${endpoints.length} endpoints × ${requestBodies.length} formats = ${endpoints.length * requestBodies.length} total attempts`);
    
    for (const endpoint of endpoints) {
      for (const requestBody of requestBodies) {
        attemptCount++;
        try {
          // Remove undefined values from request body, but keep empty strings and null
          const cleanedBody = Object.fromEntries(
            Object.entries(requestBody).filter(([, v]) => v !== undefined)
          );
          
          // Validate that we have required fields
          if (!cleanedBody.assistantId && !cleanedBody.agentId) {
            console.log(`⚠️ Attempt ${attemptCount}: Trying without agent ID - Vapi might require one`);
          }
          
          // Check what fields we have
          if (cleanedBody.phoneNumber !== undefined) {
            console.log(`✅ phoneNumber found:`, cleanedBody.phoneNumber, `(type: ${typeof cleanedBody.phoneNumber})`);
          }
          if (cleanedBody.phoneNumberId !== undefined) {
            console.log(`✅ phoneNumberId found:`, cleanedBody.phoneNumberId);
          }
          if (cleanedBody.customer !== undefined) {
            console.log(`✅ customer found:`, JSON.stringify(cleanedBody.customer));
          }
          if (!cleanedBody.phoneNumber && !cleanedBody.phoneNumberId && !cleanedBody.customer) {
            console.log(`❌ WARNING: No phone number fields found in request body!`);
          }

          console.log(`\n═══════════════════════════════════════════════════════`);
          console.log(`🔄 Attempt ${attemptCount}: ${endpoint}`);
          console.log(`═══════════════════════════════════════════════════════`);
          console.log(`📦 Request Body:`);
          console.log(JSON.stringify(cleanedBody, null, 2));
          console.log(`\n📋 Request Details:`);
          console.log(`   - Endpoint: ${endpoint}`);
          console.log(`   - Method: POST`);
          console.log(`   - Headers: Authorization: Bearer ${VAPI_KEY.substring(0, 15)}...`);
          console.log(`   - Body Keys: [${Object.keys(cleanedBody).join(', ')}]`);
          console.log(`   - Has phoneNumberId: ${'phoneNumberId' in cleanedBody} ${'phoneNumberId' in cleanedBody ? `(${cleanedBody.phoneNumberId})` : ''}`);
          console.log(`   - Has phoneNumber: ${'phoneNumber' in cleanedBody} ${'phoneNumber' in cleanedBody ? `(${cleanedBody.phoneNumber})` : ''}`);
          console.log(`   - Has to: ${'to' in cleanedBody} ${'to' in cleanedBody ? `(${cleanedBody.to})` : ''}`);
          console.log(`   - Has assistantId: ${'assistantId' in cleanedBody} ${'assistantId' in cleanedBody ? `(${cleanedBody.assistantId})` : ''}`);
          console.log(`═══════════════════════════════════════════════════════\n`);
          
          vapiResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${VAPI_KEY}`,
            },
            body: JSON.stringify(cleanedBody),
          });

          const responseText = await vapiResponse.text();
          console.log(`\n📊 Response from ${endpoint}:`);
          console.log(`   - Status: ${vapiResponse.status} ${vapiResponse.statusText}`);
          console.log(`   - Response Length: ${responseText.length} characters`);
          console.log(`   - Full Response:`);
          console.log(responseText);
          
          try {
            data = JSON.parse(responseText) as Record<string, unknown>;
            console.log(`\n📋 Parsed Response Data:`);
            console.log(JSON.stringify(data, null, 2));
          } catch {
            data = { error: 'Failed to parse response', raw: responseText };
            console.log(`\n⚠️ Could not parse response as JSON. Raw text:`);
            console.log(responseText);
          }

          if (vapiResponse.ok) {
            console.log('✅ Success! Call initiated');
            // Success - break out of loops
            return NextResponse.json({
              success: true,
              callId: (data as { id?: string })?.id,
              message: 'Call initiated successfully! You should receive a call shortly.',
              phoneNumber: formattedNumber,
            });
          }
          
          console.log(`❌ Failed with status ${vapiResponse.status}`);
          console.log(`📋 Error data:`, JSON.stringify(data, null, 2));
          lastError = { endpoint, status: vapiResponse.status, data };
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(`❌ Network/Request error for ${endpoint}:`, errorMsg);
          lastError = { 
            endpoint, 
            error: errorMsg,
            fullError: error instanceof Error ? error.stack : String(error)
          };
          continue;
        }
      }
    }

    // If we get here, all endpoint/format combinations failed
    console.error(`\n❌ Vapi API Error - All ${attemptCount} attempts failed`);
    console.error('📋 Last error details:', JSON.stringify(lastError, null, 2));
    console.error('📊 Last response data:', JSON.stringify(data, null, 2));
    
    if (!lastError && attemptCount === 0) {
      console.error('⚠️ WARNING: No attempts were made. This should not happen.');
      return NextResponse.json(
        {
          error: 'No attempts were made',
          details: { 
            message: 'All request formats were skipped. This is a code error.',
            hasAgentId: !!VAPI_AGENT_ID 
          },
          message: 'An error occurred in the API route. Please contact support.'
        },
        { status: 500 }
      );
    }
    
    if (!lastError) {
      console.error('⚠️ WARNING: No error was captured but attempts were made. This is unusual.');
    }
    
    // Provide more helpful error message
    let userMessage = 'Failed to initiate call. ';
    
    // Check if error mentions agent ID requirement
    const errorData = lastError?.data as { message?: string | string[]; error?: string } | undefined;
    const errorText = JSON.stringify(errorData || data || '').toLowerCase();
    
    // Handle array messages (Vapi sometimes returns arrays)
    const errorMessage = Array.isArray(errorData?.message) 
      ? errorData.message.join(' ') 
      : (errorData?.message || errorData?.error || '');
    const errorMessageLower = errorMessage.toLowerCase();
    
    // Get error for API response
    const apiError = lastError?.error || 
                    (data as { message?: string; error?: string })?.message || 
                    (data as { message?: string; error?: string })?.error || 
                    errorMessage ||
                    'Failed to initiate call';
    
    // Check for Twilio regional/geographic restrictions
    if (errorMessageLower.includes('cannot make calls to this region') || 
        errorMessageLower.includes('region') && errorMessageLower.includes('not available') ||
        errorMessageLower.includes('geographic') && errorMessageLower.includes('restriction') ||
        errorMessageLower.includes('not available in this region') ||
        errorMessageLower.includes('calling to this country') && errorMessageLower.includes('not allowed')) {
      userMessage = `🌍 Regional Calling Restriction: ${errorMessage}\n\n`;
      userMessage += `The number ${formattedNumber} is in a region that your Twilio account cannot call.\n\n`;
      userMessage += 'To enable calling to Pakistan (+92) and other international regions:\n\n';
      userMessage += '1. **Upgrade to a Paid Twilio Account**\n';
      userMessage += '   - Trial accounts have strict regional limitations\n';
      userMessage += '   - Upgrade at: https://www.twilio.com/console/billing/upgrade\n\n';
      userMessage += '2. **Enable Geographic Permissions**\n';
      userMessage += '   - Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/geo-permissions\n';
      userMessage += '   - Enable "Pakistan" (+92) in your geographic permissions\n';
      userMessage += '   - This prevents toll fraud and controls which countries you can call\n\n';
      userMessage += '3. **Verify Your Phone Number** (if on trial)\n';
      userMessage += '   - Trial accounts can only call verified numbers\n';
      userMessage += '   - Verify at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified\n\n';
      userMessage += '💡 **Note**: Even with a paid account, you may need to enable geographic permissions for Pakistan (+92) in your Twilio console.';
    } 
    // Check for Twilio trial account limitation (unverified numbers)
    else if (errorMessageLower.includes('unverified') || errorMessageLower.includes('trial account')) {
      userMessage = `⚠️ Twilio Trial Account Limitation: ${errorMessage}\n\n`;
      userMessage += 'To call this number, you need to:\n';
      userMessage += '1. Verify the number in your Twilio Console (https://console.twilio.com/us1/develop/phone-numbers/manage/verified)\n';
      userMessage += '2. OR upgrade your Twilio account to a paid plan\n';
      userMessage += '3. OR use a verified number for testing (e.g., your own phone number)\n\n';
      userMessage += `💡 Tip: Twilio trial accounts can only call verified numbers. Verify ${formattedNumber} in your Twilio dashboard, or upgrade to a paid account to call any number.`;
    } else if (!VAPI_AGENT_ID && (errorText.includes('agent') || errorText.includes('assistant') || lastError?.status === 400)) {
      userMessage += '⚠️ Vapi requires an Agent ID. Please add your VAPI_AGENT_ID to your .env.local file. ';
    } else if (lastError?.error?.includes('fetch') || lastError?.error?.includes('network')) {
      userMessage += 'Network error - unable to reach Vapi API. ';
    } else if (lastError?.status === 401 || lastError?.status === 403) {
      userMessage += 'Authentication failed - check your API key. ';
    } else if (lastError?.status === 404) {
      userMessage += 'Endpoint not found - Vapi API endpoint may have changed. ';
    } else if (lastError?.status === 400) {
      // Extract specific error messages from Vapi response
      if (errorMessageLower.includes('twiliophonenumber') || errorMessageLower.includes('twilioaccountsid')) {
        userMessage += 'Vapi requires Twilio configuration. ';
        if (!TWILIO_ACCOUNT_SID) {
          userMessage += 'Please add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to your .env.local file, or configure Twilio in your Vapi dashboard. ';
        } else {
          userMessage += 'Twilio credentials are set but may be incorrect. Please verify your Twilio Account SID and Auth Token. ';
        }
      } else if (errorMessageLower.includes('e.164')) {
        userMessage += 'Invalid phone number format. Please use international format (e.g., +1234567890). ';
      } else if (errorMessageLower.includes('phone number') && errorMessageLower.includes('need either')) {
        userMessage += 'Phone number configuration issue. The request format may be incorrect. ';
      } else if (errorMessageLower.includes('twilio') && (formattedNumber.startsWith('+92') || errorMessageLower.includes('pakistan'))) {
        // Catch any Twilio errors related to Pakistan numbers
        userMessage = `🌍 Twilio Calling Restriction for Pakistan (+92):\n\n`;
        userMessage += `Your Twilio account cannot make calls to Pakistan (+92) numbers.\n\n`;
        userMessage += '**Solutions:**\n\n';
        userMessage += '1. **Upgrade to Paid Account** (if on trial)\n';
        userMessage += '   - Trial accounts have regional restrictions\n';
        userMessage += '   - Upgrade: https://www.twilio.com/console/billing/upgrade\n\n';
        userMessage += '2. **Enable Geographic Permissions**\n';
        userMessage += '   - Enable Pakistan in: https://console.twilio.com/us1/develop/phone-numbers/manage/geo-permissions\n\n';
        userMessage += '3. **Contact Twilio Support**\n';
        userMessage += '   - Some regions require account verification\n';
        userMessage += '   - Support: https://support.twilio.com\n\n';
        userMessage += `**Error Details:** ${errorMessage}`;
      } else {
        userMessage += `Bad request: ${errorMessage || 'Check phone number and required parameters'}. `;
      }
    } else if (lastError?.status) {
      userMessage += `Vapi API returned error ${lastError.status}. `;
    }
    
    if (!VAPI_AGENT_ID) {
      userMessage += '\n\n💡 Tip: You need to set VAPI_AGENT_ID in your .env.local file. Get it from your Vapi dashboard at https://dashboard.vapi.ai';
    }
    
    userMessage += '\n\nCheck server logs for detailed error information.';
    
    return NextResponse.json(
      { 
        error: apiError, 
        details: lastError || data || { message: 'No error details available' },
        message: userMessage
      },
      { status: lastError?.status || 500 }
    );

  } catch (error) {
    console.error('❌ Top-level error in Vapi route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : String(error);
    console.error('📋 Error stack:', errorStack);
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: {
          message: errorMessage,
          stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
          type: error instanceof Error ? error.constructor.name : typeof error
        },
        message: 'An error occurred while processing the request. Check server logs for details.'
      },
      { status: 500 }
    );
  }
}

