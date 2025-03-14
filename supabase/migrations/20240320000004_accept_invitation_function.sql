CREATE OR REPLACE FUNCTION accept_organization_invitation(
  p_invitation_id UUID,
  p_user_id UUID
)
RETURNS void AS $$
DECLARE
  v_invitation RECORD;
  v_organization_id UUID;
BEGIN
  -- Get invitation details
  SELECT * INTO v_invitation
  FROM organization_invitations
  WHERE id = p_invitation_id
  FOR UPDATE;

  -- Validate invitation
  IF v_invitation IS NULL THEN
    RAISE EXCEPTION 'Invalid invitation';
  END IF;

  IF v_invitation.used_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invitation already used';
  END IF;

  IF v_invitation.expires_at < NOW() THEN
    RAISE EXCEPTION 'Invitation expired';
  END IF;

  -- Get organization ID
  v_organization_id := v_invitation.organization_id;

  -- Add user to organization_members
  INSERT INTO organization_members (
    organization_id,
    user_id,
    role
  ) VALUES (
    v_organization_id,
    p_user_id,
    v_invitation.role
  );

  -- Mark invitation as used
  UPDATE organization_invitations
  SET used_at = NOW()
  WHERE id = p_invitation_id;

  -- Update user's organization_id
  UPDATE users
  SET organization_id = v_organization_id
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 