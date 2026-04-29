import { TravelMap } from '../src/features/maps/map-provider';
import { VoyaScreen } from '../src/components/voya-screen';

export default function MapScreen() {
  return (
    <VoyaScreen>
      <TravelMap pins={[]} />
    </VoyaScreen>
  );
}
