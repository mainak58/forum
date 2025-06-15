import DrawerIcon from "./Drawer";

function DrawerForum() {
  return (
    <>
      <div className="flex justify-evenly items-center m-2 p-2 border-2">
        <div>
          <p>Free Plan For Every one: </p>
          <DrawerIcon />
        </div>
        <div>
          <p>Paid Plans</p>
          <DrawerIcon />
        </div>
        <div>
          <p>Paid Community Group</p>
          <DrawerIcon />
        </div>
      </div>
    </>
  );
}

export default DrawerForum;
