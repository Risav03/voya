import { useState } from 'react';
import { Text } from 'react-native';
import { Button, PremiumCard } from '@voya/ui';
import { Screen } from '../../src/components/screen';
import { FormField } from '../../src/components/form-field';
import { useIngestReel, useIngestionJob } from '../../src/features/api/hooks';

export default function ReelSaveModal() {
  const [sourceUrl, setSourceUrl] = useState('');
  const ingest = useIngestReel();
  const jobId = ingest.data?.job.id;
  const job = useIngestionJob(jobId);
  return (
    <Screen>
      <PremiumCard title="Save a reel" subtitle="Paste a travel reel or share URL. The backend will queue ingestion and resolve a place.">
        <FormField label="Reel URL" value={sourceUrl} onChangeText={setSourceUrl} placeholder="https://..." />
        <Button label={ingest.isPending ? 'Saving...' : 'Start ingestion'} onPress={() => ingest.mutate({ sourceUrl, sourcePlatform: 'other', rawSharePayload: {} })} />
        {ingest.error ? <Text>{ingest.error.message}</Text> : null}
        {jobId ? <Text>Job: {jobId}</Text> : null}
        {job.data ? <Text>Status: {JSON.stringify(job.data)}</Text> : null}
      </PremiumCard>
    </Screen>
  );
}
