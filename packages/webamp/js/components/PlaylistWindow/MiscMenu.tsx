import PlaylistMenu from "./PlaylistMenu";
import SortContextMenu from "./SortContextMenu";
import MiscOptionsContextMenu from "./MiscOptionsContextMenu";
import { useCallback } from "react";

const MiscMenu = () => {
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <PlaylistMenu id="playlist-misc-menu">
      <div className="sort-list" onClick={stopPropagation}>
        <SortContextMenu />
      </div>
      <div className="misc-options" onClick={stopPropagation}>
        <MiscOptionsContextMenu />
      </div>
    </PlaylistMenu>
  );
};

export default MiscMenu;
