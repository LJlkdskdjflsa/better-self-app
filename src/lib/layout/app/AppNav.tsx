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
import { useTranslation } from 'react-i18next';
import { CiViewTable } from 'react-icons/ci';
import { IoMdClipboard, IoMdLogOut } from 'react-icons/io';

import LanguageChanger from '~/lib/components/LanguageChanger';

const logout = () => {
  localStorage.removeItem('accessToken');
};

export default function AppNav() {
  const { t } = useTranslation();

  const menuItems = [
    {
      label: 'Menu',
      icon: <HamburgerIcon />,
      items: [
        { label: t('dashboard'), icon: <IoMdClipboard />, href: '/dashboard' },
        { label: t('positions'), icon: <CiViewTable />, href: '/positions' },
        {
          label: t('positions-deleted'),
          icon: <CiViewTable />,
          href: '/deleted-positions',
        },
      ],
    },
    {
      label: 'Profile',
      icon: <Avatar src="/avatar.png" size="sm" />,
      items: [
        {
          label: t('company-setting'),
          icon: <SettingsIcon />,
          href: '/profile',
        },
        {
          label: t('log-out'),
          icon: <IoMdLogOut />,
          href: '/',
          onClick: logout,
        },
      ],
    },
  ];
  return (
    <Box w="100%" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Image src="/logo.png" alt="Logo" boxSize="50px" />
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
        <LanguageChanger />
      </Flex>
    </Box>
  );
}
