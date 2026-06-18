
CREATE OR REPLACE FUNCTION public.touch_chat_thread()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_threads SET updated_at = now() WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.touch_chat_thread() FROM PUBLIC, anon, authenticated;
