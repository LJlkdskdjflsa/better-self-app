'use client';

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
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { CiViewTable } from 'react-icons/ci';
import { IoMdClipboard, IoMdLogOut } from 'react-icons/io';

const logout = () => {
  localStorage.removeItem('accessToken');
};

const menuItems = [
  {
    label: 'Menu',
    icon: <HamburgerIcon />,
    items: [
      { label: '招聘版面', icon: <IoMdClipboard />, href: '/dashboard' },
      { label: '職位管理', icon: <CiViewTable />, href: '/positions' },
    ],
  },
  {
    label: 'Profile',
    icon: <Avatar src="avatar.png" size="sm" />,
    items: [
      { label: '公司設定', icon: <SettingsIcon />, href: '/company-settings' },
      { label: '登出', icon: <IoMdLogOut />, href: '/', onClick: logout },
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
                <Link href={item.href} passHref key={item.label}>
                  <Flex>
                    <MenuItem icon={item.icon} onClick={item.onClick}>
                      <Text>{item.label}</Text>
                    </MenuItem>
                  </Flex>
                </Link>
              ))}
            </MenuList>
          </Menu>
        ))}
      </Flex>
    </Box>
  );
}
