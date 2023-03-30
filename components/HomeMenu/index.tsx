import Item from './HomeMenuItem';

// Type
import type HomeMenuItem from '../../types/HomeMenuItem';

type Props = {
	menu: HomeMenuItem[],
    onItemClick: (menuItem: HomeMenuItem) => void,
};

const HomeMenu = ({ menu, onItemClick }: Props) => (
    <div className="grid grid-cols-2 gap-4">
        {menu.map((menuItem) => (
            <Item
                key={menuItem.code}
                {...menuItem}
                onClick={() => onItemClick(menuItem)}
            />
        ))}
    </div>
);

export default HomeMenu;