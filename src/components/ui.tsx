import { t, usePreferences } from "@/state/preferences";
import {
  Card as MantineCard,
  CardProps,
  Title,
  Text,
  Group,
  Stack,
  Box,
} from "@mantine/core";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export {
  Accordion,
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Flex,
  Grid,
  Group,
  List,
  NativeSelect,
  Paper,
  PasswordInput,
  ScrollArea,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  UnstyledButton,
} from "@mantine/core";

export function Card({
  children,
  className = "",
  shadow = "xs",
  padding = "lg",
  radius = "32px",
  withBorder = true,
  id,
  style,
  ...props
}: CardProps & {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}) {
  usePreferences();
  return (
    <MantineCard
      id={id}
      style={style}
      shadow={shadow}
      padding={padding}
      radius={radius}
      withBorder={withBorder}
      className={className}
      {...props}
    >
      {children}
    </MantineCard>
  );
}

export function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  usePreferences();
  return (
    <Box mb="lg" className="page-title">
      {eyebrow && (
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1} mb={4}>
          {t(eyebrow)}
        </Text>
      )}
      <Title order={1} size="h1" fw={800}>
        {t(title)}
      </Title>
      {description && (
        <Text size="sm" c="dimmed" mt={4}>
          {t(description)}
        </Text>
      )}
    </Box>
  );
}

export function SectionTitle({
  title,
  to,
  link = "詳しく見る",
}: {
  title: string;
  to?: string;
  link?: string;
}) {
  usePreferences();
  return (
    <Group justify="space-between" align="center" my="md" className="section-title">
      <Title order={2} size="h3" fw={700}>
        {t(title)}
      </Title>
      {to && (
        <Link
          to={to}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--foreground)",
          }}
        >
          {t(link)}
          <ArrowUpRight size={15} />
        </Link>
      )}
    </Group>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  usePreferences();
  return (
    <Card p="xl" style={{ textAlign: "center" }}>
      <Text c="dimmed" size="sm">
        {children}
      </Text>
    </Card>
  );
}
