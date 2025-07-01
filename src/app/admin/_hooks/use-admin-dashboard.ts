"use client";

import { useState, useEffect } from "react";
import { Notification, Reservation } from "@/lib/types";
import { interestOptions } from "@/lib/schemas";

/**
 * 興味カテゴリIDから表示用ラベルを取得する
 */
const getInterestLabel = (interestId: string): string => {
  const option = interestOptions.find((opt) => opt.id === interestId);
  return option ? option.label : interestId;
};

/**
 * ダッシュボード統計を計算する
 *
 * 登録データから総数、今週の登録数、最も人気の興味分野を算出します。
 */
const calculateStats = (reservations: Reservation[]) => {
  const total = reservations.length;

  // 今週の登録数を計算（過去7日間）
  const thisWeek = reservations.filter((r) => {
    const date = new Date(r.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date > weekAgo;
  }).length;

  // 最も人気の興味分野を集計・算出
  const mostPopularInterest =
    Object.entries(
      reservations.reduce((acc, r) => {
        r.interests.forEach((f) => {
          acc[f] = (acc[f] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>)
    ).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  return { total, thisWeek, mostPopularInterest };
};

/**
 * 管理画面ダッシュボード機能フック
 *
 * 事前登録データの管理、統計情報の計算、通知機能、ページネーション機能を
 * 統合的に提供します。データはLocalStorageを使用してクライアントサイドで
 * 保持されます。
 */
export const useAdminDashboard = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 初期データ読み込み：LocalStorageから保存されたデータを取得
  useEffect(() => {
    const reservationsData = localStorage.getItem("reservations");
    if (reservationsData) {
      setReservations(JSON.parse(reservationsData));
    } else {
      // プレビュー用の初期ダミーデータを設定
      const dummyReservations = [
        {
          id: "1",
          name: "田中 太郎",
          email: "tanaka@example.com",
          interests: ["habit-challenge", "voice-chat"],
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3日前
        },
        {
          id: "2",
          name: "鈴木 花子",
          email: "suzuki@example.com",
          interests: ["user-events"],
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2日前
        },
        {
          id: "3",
          name: "佐藤 次郎",
          email: "sato@example.com",
          interests: ["habit-challenge", "user-events"],
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1日前
        },
        {
          id: "4",
          name: "高橋 美咲",
          email: "takahashi@example.com",
          interests: ["voice-chat", "user-events"],
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12時間前
        },
        {
          id: "5",
          name: "山田 健一",
          email: "yamada@example.com",
          interests: ["habit-challenge"],
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(), // 6時間前
        },
      ];
      setReservations(dummyReservations);
      localStorage.setItem("reservations", JSON.stringify(dummyReservations));
    }

    const notificationsData = localStorage.getItem("notifications");
    if (notificationsData) {
      setNotifications(JSON.parse(notificationsData));
    } else {
      // プレビュー用の初期通知データを設定
      const dummyNotifications = [
        {
          id: "1",
          type: "new_registration",
          title: "新規登録",
          message: "山田 健一さんが事前登録しました",
          isRead: false,
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        },
        {
          id: "2",
          type: "new_registration",
          title: "新規登録",
          message: "高橋 美咲さんが事前登録しました",
          isRead: false,
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          id: "3",
          type: "new_registration",
          title: "新規登録",
          message: "佐藤 次郎さんが事前登録しました",
          isRead: true,
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        },
      ];
      setNotifications(dummyNotifications);
      localStorage.setItem("notifications", JSON.stringify(dummyNotifications));
    }
  }, []);

  /**
   * 特定の通知を既読にマークする
   */
  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  /**
   * 全ての通知を既読にマークする
   */
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  // ページネーション計算：パフォーマンスを考慮して表示件数を制限
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = reservations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const stats = calculateStats(reservations);
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return {
    // データ
    reservations,
    notifications,
    paginatedReservations,
    stats,
    unreadNotifications,

    // ページネーション
    currentPage,
    totalPages,
    setCurrentPage,

    // アクション
    markNotificationAsRead,
    markAllAsRead,

    // ユーティリティ
    getInterestLabel,
  };
};
