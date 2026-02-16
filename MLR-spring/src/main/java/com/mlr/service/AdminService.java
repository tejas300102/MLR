package com.mlr.service;

import com.mlr.dto.RuleStatusResponseDto;
import com.mlr.dto.SystemAnalyticsDto;
import com.mlr.dto.UserSummaryDto;
import com.mlr.entity.Category;

import java.util.List;

public interface AdminService {
    List<UserSummaryDto> getAllUsers(String search);
    boolean blockUser(String userId);
    boolean unblockUser(String userId);
    boolean resetWallet(String userId);
    SystemAnalyticsDto getSystemAnalytics();
    List<Category> getCategories();
    RuleStatusResponseDto getRulesStatus();
}