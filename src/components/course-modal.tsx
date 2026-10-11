import { Modal, Stack, Button, Text, SimpleGrid } from "@mantine/core";
import { t } from "@/state/preferences";
import { COURSE_LABELS, CourseId, setCourse } from "@/data/course";

interface CourseSelectModalProps {
  opened: boolean;
  onClose?: () => void;
  allowClose?: boolean;
}

export function CourseSelectModal({
  opened,
  onClose,
  allowClose = false,
}: CourseSelectModalProps) {
  const handleSelect = (course: CourseId) => {
    setCourse(course, true);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (allowClose && onClose) {
          onClose();
        }
      }}
      withCloseButton={allowClose}
      closeOnClickOutside={allowClose}
      closeOnEscape={allowClose}
      title={
        <Text fw={700} size="lg" c="var(--foreground">
          {t("学科の選択")}
        </Text>
      }
      centered
    >
      <Stack gap="md">
        <Text fw={600} size="sm" c="var(--blue)">
          {t("学科を選択してください")}
        </Text>

        <SimpleGrid cols={2} spacing="md">
          {(["i", "k"] as CourseId[]).map((c) => (
            <Button
              key={c}
              size="md"
              color="var(--foreground)"
              style={{ height: "auto", padding: "12px" }}
              onClick={() => handleSelect(c)}
            >
              <Text fw={700} size="lg" c="var(--surface)">
                {COURSE_LABELS[c]}
              </Text>
            </Button>
          ))}
        </SimpleGrid>
      </Stack>
    </Modal>
  );
}
