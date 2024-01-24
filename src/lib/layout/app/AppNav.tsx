import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from '@chakra-ui/react';
import { CiViewTable } from 'react-icons/ci';
import { IoMdClipboard, IoMdLogOut } from 'react-icons/io';

const menuItems = [
  {
    label: 'Menu',
    icon: <HamburgerIcon />,
    items: [
      { label: '招聘版面', icon: <IoMdClipboard /> },
      { label: '職位管理', icon: <CiViewTable /> },
    ],
  },
  {
    label: 'Profile',
    icon: <Avatar src="avatar.png" size="sm" />,
    items: [
      { label: '公司設定', icon: <SettingsIcon /> },
      { label: '登出', icon: <IoMdLogOut /> },
    ],
  },
];

export default function AppNav() {
  return (
    <Box w="100%" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Image src="logo.png" alt="Logo" boxSize="50px" />
        <Spacer />
        {menuItems.map((menuItem) => (
          <Menu key={menuItem.label}>
            <MenuButton
              as={Button}
              rightIcon={menuItem.icon}
              variant="ghost"
              mr={4}
            />
            <MenuList>
              {menuItem.items.map((item) => (
                <MenuItem key={item.label} icon={item.icon}>
                  {item.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        ))}
      </Flex>
    </Box>
  );
}
