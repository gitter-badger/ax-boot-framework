package com.chequer.axboot.core.domain.manual;

import com.chequer.axboot.core.domain.JPAQueryDSLRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManualRepository extends JPAQueryDSLRepository<Manual, Long> {
}
