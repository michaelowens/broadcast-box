import React, {useEffect, useState, useRef, useCallback} from "react";
import {UsersIcon} from "@heroicons/react/20/solid";

interface CurrentViewersComponentProps {
  streamKey: string;
}

interface ViewerCountResponse {
  viewerCount: number;
}

const CurrentViewersComponent = (props: CurrentViewersComponentProps) => {
  const { streamKey } = props;
  const [currentViewersCount, setCurrentViewersCount] = useState<number>(0);
  const apiPath = import.meta.env.VITE_API_PATH;
  const intervalRef = useRef<number | null>(null);

  const fetchViewerCount = useCallback(async () => {
    if (!streamKey) {
      return;
    }

    try {
      const response = await fetch(`${apiPath}/stream/${streamKey}/viewers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data: ViewerCountResponse = await response.json();
        setCurrentViewersCount(data.viewerCount);
      }
    } catch (error) {
      console.error("Error fetching viewer count:", error);
    }
  }, [streamKey, apiPath]);

  useEffect(() => {
    fetchViewerCount();

    // Poll every 5 seconds
    intervalRef.current = window.setInterval(fetchViewerCount, 5000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchViewerCount]);

  return (
    <div className={"flex flex-row items-center gap-1"}>
      <UsersIcon className={"size-4"}/>
      {currentViewersCount}
    </div>
  )
}

export default CurrentViewersComponent