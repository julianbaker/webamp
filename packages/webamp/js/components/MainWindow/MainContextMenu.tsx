import { memo, Fragment, useEffect } from "react";
import * as Actions from "../../actionCreators";
import * as Selectors from "../../selectors";
import { LOAD_STYLE, WINDOWS } from "../../constants";
import { Hr, Node, Parent, LinkNode } from "../ContextMenu";
import PlaybackContextMenu from "../PlaybackContextMenu";
import OptionsContextMenu from "../OptionsContextMenu";
import SkinsContextMenu from "../SkinsContextMenu";
import { FilePicker, WindowId } from "../../types";
import { useTypedSelector, useActionCreator } from "../../hooks";

interface Props {
  filePickers: FilePicker[];
}

const MainContextMenu = memo(({ filePickers }: Props) => {
  const networkConnected = useTypedSelector(Selectors.getNetworkConnected);
  const genWindows = useTypedSelector(Selectors.getGenWindows);

  const close = useActionCreator(Actions.close);
  const openMediaFileDialog = useActionCreator(Actions.openMediaFileDialog);
  const loadMediaFiles = useActionCreator(Actions.loadMediaFiles);
  const toggleWindow = useActionCreator(Actions.toggleWindow);
  const menuOpened = useActionCreator(() => ({
    type: "MAIN_CONTEXT_MENU_OPENED",
  }));
  const isMilkdropEnabled = useTypedSelector(Selectors.getMilkdropEnabled);
  const windowMenuOrder: WindowId[] = [
    WINDOWS.MAIN,
    WINDOWS.EQUALIZER,
    WINDOWS.PLAYLIST,
    WINDOWS.AUDIUS,
    WINDOWS.MILKDROP,
  ];
  const orderedWindows = [
    ...windowMenuOrder.filter((windowId) => genWindows[windowId] != null),
    ...(Object.keys(genWindows).filter(
      (windowId) => !windowMenuOrder.includes(windowId as WindowId)
    ) as WindowId[]),
  ];

  useEffect(() => {
    menuOpened();
  }, [menuOpened]);

  return (
    <Fragment>
      <LinkNode
        href="https://webamp.org/about"
        target="_blank"
        label="Webamp..."
      />
      <Hr />
      <Parent label="Play">
        <Node onClick={openMediaFileDialog} label="File..." hotkey="L" />
        {filePickers != null &&
          filePickers.map(
            (picker, i) =>
              (networkConnected || !picker.requiresNetwork) && (
                <Node
                  key={i}
                  onClick={async () => {
                    let files;
                    try {
                      files = await picker.filePicker();
                    } catch (e) {
                      console.error("Error loading from file picker", e);
                    }
                    loadMediaFiles(files || [], LOAD_STYLE.PLAY);
                  }}
                  label={picker.contextMenuName}
                />
              )
          )}
      </Parent>
      <Hr />
      {orderedWindows.map((windowId) => {
        if (windowId === WINDOWS.MILKDROP && !isMilkdropEnabled) {
          return null;
        }
        return (
          <Node
            key={windowId}
            label={genWindows[windowId].title}
            checked={genWindows[windowId].open}
            onClick={() => toggleWindow(windowId)}
            hotkey={genWindows[windowId].hotkey}
          />
        );
      })}
      <Hr />
      <SkinsContextMenu />
      <Hr />
      <Parent label="Options">
        <OptionsContextMenu />
      </Parent>
      <Parent label="Playback">
        <PlaybackContextMenu />
      </Parent>
      <Hr />
      <Node onClick={close} label="Exit" />
    </Fragment>
  );
});

export default MainContextMenu;
