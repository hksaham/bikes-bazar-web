INSERT INTO storage.buckets (id, name, public)
VALUES ('bike-images', 'bike-images', true);

CREATE POLICY "Bike images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'bike-images');

CREATE POLICY "Allow upload to bike-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'bike-images');

CREATE POLICY "Allow delete from bike-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'bike-images');

CREATE POLICY "Allow update in bike-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'bike-images');