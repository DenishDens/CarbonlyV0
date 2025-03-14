CREATE OR REPLACE FUNCTION execute_query(query_text TEXT, query_params JSONB DEFAULT '[]'::JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  params TEXT[];
  i INTEGER;
BEGIN
  -- Convert JSONB array to text array
  IF jsonb_typeof(query_params) = 'array' THEN
    params := ARRAY[]::TEXT[];
    FOR i IN 0..jsonb_array_length(query_params) - 1 LOOP
      params := params || jsonb_array_element_text(query_params, i);
    END LOOP;
  END IF;
  
  -- Execute the query with parameters
  EXECUTE format('SELECT jsonb_agg(row_to_json(t)) FROM (%s) t', query_text)
  INTO result
  USING VARIADIC params;
  
  -- Return empty array if null
  RETURN COALESCE(result, '[]'::JSONB);
EXCEPTION WHEN OTHERS THEN
  -- Return error information
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'detail', SQLSTATE,
    'query', query_text
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION execute_query TO authenticated;

