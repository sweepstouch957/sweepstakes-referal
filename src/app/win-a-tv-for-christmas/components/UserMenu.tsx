/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import React from "react";

interface UserMenuProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: (el: null | HTMLElement) => void;
  user: any;
  handleLogout: () => void;
}

const getInitials = (firstName?: string, lastName?: string) =>
  `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

const UserMenu: React.FC<UserMenuProps> = ({
  anchorEl,
  setAnchorEl,
  user,
  handleLogout,
}) => {
  const open = Boolean(anchorEl);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 230,
          py: 1,
          boxShadow: "0 8px 24px rgba(0,0,0,0.09)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1.2,
          gap: 1.4,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#c62828",
            width: 40,
            height: 40,
            fontWeight: 700,
          }}
        >
          {getInitials(user?.firstName, user?.lastName)}
        </Avatar>
        <Box>
          <Typography fontWeight={700} fontSize={16} color="#222">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={13}>
            {user?.email || "Participante"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          handleLogout();
        }}
        sx={{ py: 1.2, fontWeight: 600, color: "#c62828" }}
      >
        <LogoutIcon fontSize="small" sx={{ mr: 1, color: "#c62828" }} />
        <Typography color="inherit" fontWeight={600}>
          Logout
        </Typography>
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;
