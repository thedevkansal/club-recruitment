const validate = (schema) => {
  return (req, res, next) => {
    try {
      console.log('🔍 Validating request body:', req.body);
      
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        console.log('❌ Validation failed:', result.error.errors);
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors
        });
      }
      
      console.log('✅ Validation passed');
      // Replace req.body with validated data
      req.body = result.data;
      next();
    } catch (error) {
      console.log('💥 Validation error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Validation error'
      });
    }
  };
};

module.exports = { validate };
