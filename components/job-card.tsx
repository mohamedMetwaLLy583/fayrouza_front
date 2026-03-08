"use client";

import { useRouter } from "next/navigation";
import { Heart, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import { useToast } from "@/components/toast-notification";
import { useI18n } from "@/lib/i18n/context";
import Image from "next/image";

import { Ad } from '@/api/home.api';

interface JobCardProps {
  job: Ad;
  onClick?: (jobId: string) => void;
  onFavoriteClick?: (jobId: string, isFavorited: boolean) => void;
}

export function JobCard({ job, onClick, onFavoriteClick }: JobCardProps) {
  const router = useRouter();
  const { t, dir } = useI18n();
  const [isFavorited, setIsFavorited] = useState(
    () => job.is_favourited || false,
  );
  const { showToast, ToastContainer } = useToast();
  const {
    toggleFavorite,
    isLoading: favoriteLoading,
    isAuthenticated,
    showLoginPrompt,
  } = useFavorites({ showToast });

  const handleClick = () => {
    if (onClick) {
      onClick(job.id);
    } else {
      router.push(`/ads/${job.id}`);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (favoriteLoading) return;

    if (!isAuthenticated) {
      showLoginPrompt();
      return;
    }

    const newFavoriteState = !isFavorited;

    if (onFavoriteClick) {
      onFavoriteClick(job.id, newFavoriteState);
      setIsFavorited(newFavoriteState);
    } else {
      const result = await toggleFavorite(job.id, newFavoriteState);
      setIsFavorited(result.newState);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white border border-gray-100 rounded-[24px] p-6 hover:shadow-xl hover:border-[#3F51B5]/20 transition-all duration-300 cursor-pointer relative flex flex-col items-center text-center"
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        disabled={favoriteLoading || !isAuthenticated}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 z-10 ${
          isFavorited ? "text-[#FF4B4B]" : "text-gray-300 hover:text-[#FF4B4B]"
        }`}
      >
        <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
      </button>

      {/* Avatar Container */}
      <div className="relative w-24 h-24 mb-4">
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#3F51B5]/10 p-1 bg-white">
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <img
              src={job.author_image || "/Logo.png"}
              alt={job.author_name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Active status bubble if needed? Not in design but common */}
      </div>

      {/* Job Title & Info */}
      <div className="space-y-1 w-full overflow-hidden px-2">
        <h4 className="text-[18px] font-black text-gray-900 leading-tight truncate">
          {job.author_name}
        </h4>
        <p className="text-[#3F51B5] text-[15px] font-bold truncate">
          {job.title}
        </p>
      </div>

      {/* Metadata */}
      <div className="flex flex-col items-center gap-2 mt-4 text-[13px] text-gray-400 font-bold w-full">
        <div className="flex items-center gap-1.5 justify-center">
          <MapPin className="w-4 h-4 text-[#3F51B5]/40" />
          <span className="truncate max-w-[150px]">{job.address}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <Clock className="w-4 h-4 text-[#3F51B5]/40" />
          <span>
            {(() => {
              const createdAt = new Date(job.created_at);
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - createdAt.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays === 0) return t("adCardToday");
              if (diffDays === 1) return t("adCardOneDayAgo");
              return t("adCardDaysAgo", { days: diffDays });
            })()}
          </span>
        </div>
      </div>

      {/* Salary/Price Badge */}
      <div className="mt-6 w-full">
        <div className="inline-flex items-center px-6 py-2 rounded-full bg-[#FFBB37]/10 text-[#FFBB37] font-black text-[15px] border border-[#FFBB37]/20">
          {job.price} {t("adCardSAR")}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
