import PlaylistMenu from "./PlaylistMenu";
import SortContextMenu from "./SortContextMenu";
import MiscOptionsContextMenu from "./MiscOptionsContextMenu";
import * as Actions from "../../actionCreators";
import * as Selectors from "../../selectors";
import { WINDOWS } from "../../constants";
import { useActionCreator, useTypedSelector } from "../../hooks";

const MiscMenu = () => {
  const toggleWindow = useActionCreator(Actions.toggleWindow);
  const setFocusedWindow = useActionCreator(Actions.setFocusedWindow);
  const getWindowOpen = useTypedSelector(Selectors.getWindowOpen);

  const handleOpenAudius = () => {
    if (!getWindowOpen(WINDOWS.AUDIUS)) {
      toggleWindow(WINDOWS.AUDIUS);
    }
    setFocusedWindow(WINDOWS.AUDIUS);
  };

  return (
    <PlaylistMenu id="playlist-misc-menu">
      <div className="sort-list" onClick={(e) => e.stopPropagation()}>
        <SortContextMenu />
      </div>
      <div className="file-info" onClick={handleOpenAudius} />

      <div className="misc-options" onClick={(e) => e.stopPropagation()}>
        <MiscOptionsContextMenu />
      </div>
    </PlaylistMenu>
  );
};

export default MiscMenu;
