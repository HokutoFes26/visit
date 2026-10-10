import { t, usePreferences } from "@/state/preferences";
import {
  Box,
  Card,
  Divider,
  Group,
  PageTitle,
  Text,
  ThemeIcon,
} from "@/components/ui";
import {
  Bell,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import "@/styles/more.css";

export default function MorePage() {
  usePreferences();

  const groups = [
    {
      title: "サポート",
      items: [
        {
          to: "/announcements",
          title: "お知らせ",
          description: "連絡事項・更新情報",
          icon: Bell,
          color: "orange",
        },
        {
          to: "/guide",
          title: "見学ガイド",
          description: "集合・持ち物・注意事項",
          icon: BookOpen,
          color: "blue",
        },
        {
          to: "/learning",
          title: "事前学習",
          description: "訪問企業の課題・チェックリスト",
          icon: GraduationCap,
          color: "violet",
        },
      ],
    },
    {
      title: "アプリ・設定",
      items: [
        {
          to: "/settings",
          title: "設定",
          description: "言語・表示テーマ・データ管理",
          icon: Settings,
          color: "gray",
        },
      ],
    },
  ];

  return (
    <div className="more-page">
      <PageTitle title={t("その他")} />

      {groups.map((group) => (
        <Box key={group.title} mb="xl">
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            lts={1}
            mb={8}
            px={4}
          >
            {t(group.title)}
          </Text>
          <Card
            padding={0}
            radius="16px"
            withBorder
            className="more-group-card"
          >
            {group.items.map((item, index) => (
              <div key={item.to}>
                {index > 0 && <Divider className="more-divider" />}
                <Link to={item.to} className="more-list-item">
                  <Group gap="sm" wrap="nowrap" className="more-item-left">
                    <ThemeIcon
                      size={40}
                      radius="md"
                      variant="light"
                      color={item.color}
                      className="more-item-icon"
                    >
                      <item.icon size={20} />
                    </ThemeIcon>
                    <Box className="more-item-text">
                      <Text size="sm" fw={600} className="more-item-title">
                        {t(item.title)}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {t(item.description)}
                      </Text>
                    </Box>
                  </Group>
                  <ChevronRight size={18} className="more-item-arrow" />
                </Link>
              </div>
            ))}
          </Card>
        </Box>
      ))}
    </div>
  );
}
