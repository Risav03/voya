import type { PropsWithChildren } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TAB_BAR_EXTRA_PADDING = 88;

export function VoyaScreen({
  children,
  scroll = true,
}: PropsWithChildren<{ scroll?: boolean }>) {
  if (scroll) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
        <ScrollView
          contentContainerClassName="gap-4 px-[22px] pt-2"
          contentContainerStyle={{ paddingBottom: TAB_BAR_EXTRA_PADDING }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-bg px-[22px]"
      style={{ paddingBottom: TAB_BAR_EXTRA_PADDING }}
      edges={['top']}
    >
      {children}
    </SafeAreaView>
  );
}
