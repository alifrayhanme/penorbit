// Common API response patterns
export const apiResponse = {
  success: (data, status = 200) => Response.json(data, { status }),
  error: (message, status = 500) => Response.json({ error: message }, { status }),
  created: (data) => Response.json(data, { status: 201 }),
  notFound: (message = 'Not found') => Response.json({ error: message }, { status: 404 }),
  badRequest: (message = 'Bad request') => Response.json({ error: message }, { status: 400 })
};

// Common validation patterns
export const validate = {
  required: (value, fieldName) => {
    if (!value?.trim()) throw new Error(`${fieldName} is required`);
  },
  email: (email) => {
    if (!email?.includes('@')) throw new Error('Valid email is required');
  },
  minLength: (value, min, fieldName) => {
    if (!value || value.length < min) throw new Error(`${fieldName} must be at least ${min} characters`);
  }
};

// API handler wrapper
export const apiHandler = (handler) => async (request, context) => {
  try {
    return await handler(request, context);
  } catch (error) {
    console.error('API Error:', error);
    return apiResponse.error(error.message);
  }
};