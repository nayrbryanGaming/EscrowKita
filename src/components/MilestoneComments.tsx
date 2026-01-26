"use client";
import React from 'react';

export default function MilestoneComments({ milestoneIndex }: { milestoneIndex: number }) {
  return (
    <div className="text-xs text-slate-400 mt-2">Comments for milestone {milestoneIndex + 1}</div>
  );
}
